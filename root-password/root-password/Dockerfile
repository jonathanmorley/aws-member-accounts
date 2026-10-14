FROM node:alpine@sha256:6f08a523443ddedf52941874c203475b0ad503e859ad70cb26ab8be9a517dbd5
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
