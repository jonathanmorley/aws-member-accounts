FROM node:alpine@sha256:f4769ca6eeb6ebbd15eb9c8233afed856e437b75f486f7fccaa81d7c8ad56007
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
