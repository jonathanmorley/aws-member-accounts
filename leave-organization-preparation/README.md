# AWS Member Accounts - Leave Organization Preparation

This lambda will be called as part of a cloudformation stack.
It will prepare the account for leaving the organization, ensuring that the
following settings are configured:
  * Provide contact information
  * Accept the AWS Customer Agreement
  * Provide a valid payment method
  * Verify the phone number
  * Select a support plan option

## Building

1. ```
IMAGE="$(docker build leave-organization-preparation | tail -n1 | awk '{ print $NF }')" && \
docker run --rm "${IMAGE}" > leave-organization-preparation.zip
```
(For zsh, `>!` is useful to ensure that the zip is CLOBBERed)

2. ```
aws cloudformation package --template-file template.yaml --s3-bucket 'SCRATCH_BUCKET' --output-template-file template.sam.yaml
```

## Deploying

1. ```
aws cloudformation deploy --template-file template.sam.yaml --stack-name aws-member-accounts-leave-organization-preparation --capabilities CAPABILITY_IAM
```
