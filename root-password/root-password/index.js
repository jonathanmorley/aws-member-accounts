'use strict';

const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const ssm = new AWS.SSM();
const organizations = new AWS.Organizations();

const util = require('util')
const simpleParser = require("mailparser").simpleParser;
const chrome = require('chrome-aws-lambda');
const puppeteer = require('puppeteer-core');
const PasswordGenerator = require('strict-password-generator').default;

const bucketName = process.env.EMAIL_BUCKET;
const resetLinkPattern = new RegExp(/Click the link below to reset your password using our secure server:<br><br>(.+?)<br><br>/);

exports.handler = async (event) => {
  const sesNotification = event.Records[0].ses;

  // Retrieve the email from your bucket
  const data = await s3.getObject({ Bucket: bucketName, Key: sesNotification.mail.messageId }).promise();

  // Parse the email
  const email = await simpleParser(data.Body);

  const to_address = email.to.value[0].address;
  if (!to_address) {
    throw new Error("No 'To Address' found");
  }

  var account = await findAccountByEmail(to_address);
  if (!account) {
    throw new Error(`No member account found for address: ${to_address}`);
  }

  // Try to find the password reset link
  const resetLinkMatch = email.html.match(resetLinkPattern);
  if (!resetLinkMatch) {
    console.error("Email Body:")
    console.error(data.Body.toString())
    throw new Error('No reset link found');
  }

  const passwordGenerator = new PasswordGenerator();
  const password = passwordGenerator.generatePassword({ exactLength: 15 });

  await resetPassword(resetLinkMatch[1], password)

  console.log("Saving new password to SSM Parameter Store");
  await ssm.putParameter({
    Name: `/member-accounts/${account['Id']}/password`, /* required */
    Type: 'SecureString',
    Value: password,
    Description: `Root Password for the ${account['Id']} member account`,
    Overwrite: true
  }).promise();
};

async function resetPassword(resetLink, password) {
  const browser = await puppeteer.launch({
    args: chrome.args,
    executablePath: await chrome.executablePath,
    headless: chrome.headless,
  });

  const page = await browser.newPage();
  await page.goto(resetLink);

  await page.type('#new_password', password);
  await page.type('#confirm_password', password);

  await Promise.all([
    page.waitForSelector('#success_title'),
    page.$eval('#reset_password_submit', button => button.click()),
  ]);

  await browser.close();
}

async function findAccountByEmail(emailAddress) {
  var account;
  await organizations.listAccounts().on('success', function handlePage(response) {
    var found = response.data['Accounts'].find(function(account) {
      return account['Email'] === emailAddress;
    });

    if (found) {
      account = found;
      return;
    } else if (response.hasNextPage()) {
      response.nextPage().on('success', handlePage).send();
    }
  }).promise();

  return account;
}
