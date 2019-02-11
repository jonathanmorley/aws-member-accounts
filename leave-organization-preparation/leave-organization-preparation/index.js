'use strict';

const AWS = require('aws-sdk');
const s3 = new AWS.S3();

const util = require('util')
const chrome = require('chrome-aws-lambda');
const puppeteer = require('puppeteer-core');

const accountId = process.env.ACCOUNT_ID;

const scratchBucket = process.env.SCRATCH_BUCKET;

const paymentUrl = "https://portal.aws.amazon.com/billing/signup?enforcePI=True#/paymentinformation"

const loginUrl = "https://console.aws.amazon.com/"
//const loginUrl = `https://signin.aws.amazon.com/signin?redirect_uri=${encodeURIComponent(paymentUrl)}&client_id=arn%3Aaws%3Aiam%3A%3A${accountId}%3Auser%2Fhomepage`

//const paymentUrl = "https://portal.aws.amazon.com/gp/aws/developer/registration/index.html?client=organizations&enforcePI=True"

exports.handler = async (event) => {
  console.log(loginUrl);

  const browser = await puppeteer.launch({
    args: chrome.args,
    executablePath: await chrome.executablePath,
    headless: chrome.headless,
  });

  const page = await browser.newPage();

  await Promise.all([
    await page.waitForFunction('window.ready'),
    await page.goto(loginUrl);
]);

  const screenshot = await page.screenshot({ type: 'png' });
  await s3.putObject({ Bucket: scratchBucket, Key: 'screenshot.png', Body: screenshot }).promise();

  await browser.close();
};
