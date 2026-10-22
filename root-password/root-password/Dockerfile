FROM node:alpine@sha256:40cd011b55415bc894e45b02fdd5a5dfde056921b7d23a64c74f80497af48797
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
