FROM node:alpine@sha256:143494b1da2945f061539253adc65e4f1569ddf07da2d384c022c791a9d90a4a
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
