### STAGE 1: Build ###
FROM node:16-alpine AS build
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build -- --configuration production
### STAGE 2: Run ###
FROM nginx:1.21.6-alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /usr/src/app/dist/socrates /usr/share/nginx/html