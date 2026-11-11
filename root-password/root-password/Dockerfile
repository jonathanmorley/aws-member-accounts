FROM node:alpine@sha256:ce8c3a386c7649c1f9a38d29eb9f6b0c29e70707eb50f208643a75b3f763b60f
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
