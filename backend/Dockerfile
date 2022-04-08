FROM node:17.7.2-alpine

RUN apk add --update docker
# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json swagger swagger.js ./
ADD models models
RUN npm install --force
RUN npm run swagger-autogen
# If you are building your code for production
RUN npm ci --only=production

# Bundle app source
COPY . .

EXPOSE 4000
CMD [ "node","server.js" ]