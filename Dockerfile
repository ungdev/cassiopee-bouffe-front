# This image is optimized to work with openshift requirements
# More info on contraints on https://docs.openshift.com/container-platform/4.7/openshift_images/create-images.html#images-create-guide-openshift_create-images
FROM node:16-alpine AS builder

# Set the application to production (does not download dev depedencies)
ENV NODE_ENV production
WORKDIR /srv/app
EXPOSE 8080

# Copy the package.json and yarn.lock. This is used to cache and avoid to download the dependencies every time
# Force yarn to install the dependencies with yarn.lock and clear the cache
COPY ./package.json ./yarn.lock ./

# Create folders that will be used for build time
RUN yarn --frozen-lockfile

# Copy the rest of the code
COPY . .

# Build the application
RUN yarn build

# Run a second layer to run only the html
FROM nginxinc/nginx-unprivileged:stable-alpine AS deployer

# Redirect all url to index to be able to handle it as a router
RUN sed -i '/index  index.html index.htm;/a try_files $uri $uri\/ \/index.html;' /etc/nginx/conf.d/default.conf

# Copy the build from the first layer to the second
COPY --from=builder /srv/app/dist/ /usr/share/nginx/html/

# Set a random uid and the root gid
USER 5000:0
