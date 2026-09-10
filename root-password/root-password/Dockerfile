FROM node:alpine@sha256:ef24c5053d50fdc3e4e56eb4e7ddb7861874ab0fdc797046ba897581deb8e868
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
