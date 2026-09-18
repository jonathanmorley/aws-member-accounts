FROM node:alpine@sha256:d1afba4b9c2edf2dcc56684c90e6c670309eecbc558b9d4bc7f530efb9934b43
WORKDIR /app

# zip is necessary
RUN apk --no-cache add zip

# Fetch any dependencies
COPY package* ./
RUN npm install

# Fetch everything else
COPY . .

# Output the zip
CMD zip --recurse-paths - -x@.zipignore .
