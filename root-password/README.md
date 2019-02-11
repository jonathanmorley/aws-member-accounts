# AWS Member Accounts - Root Password

This lambda will be called when a password reset is requested.
A new root password will be generated and stored in SSM Parameter Store.

## Building

1. ```
IMAGE="$(docker build leave-organization-preparation | tail -n1 | awk '{ print $NF }')" && \
docker run --rm "${IMAGE}" > root-password.zip
```
(For zsh, `>!` is useful to ensure that the zip is CLOBBERed)

2. ```
aws cloudformation package --template-file template.yaml --s3-bucket 'SCRATCH_BUCKET' --output-template-file template.sam.yaml
```

## Deploying

1. ```
aws cloudformation deploy --template-file template.sam.yaml --stack-name aws-member-accounts-root-password --capabilities CAPABILITY_IAM
```
