---
description: Want to contribute? Great!
---

# 🖥 Development

Socrates uses Node.JS + Angular for developing. For fast development, use these commands to run the infrastructure of Socrates.

#### Infrastructure

MongoDB Replica Set:

```
docker run --rm -d -p 27017:27017 -h $(hostname) -v ~/mongo/data:/data/db --name mongo mongo:latest --replSet=test && sleep 4 && docker exec mongo mongo --eval "rs.initiate();
```

Minio S3 Server:

```
docker run -p 9000:9000 -p 9001:9001 --name minio -v ~/minio/data:/data -e "MINIO_ROOT_USER=AKIAIOSFODNN7EXAMPLE" -e "MINIO_ROOT_PASSWORD=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY" quay.io/minio/minio server /data --console-address ":9001"
```

(optional) MongoDB UI:

```
docker run -it --rm --name mongo-express -p 8081:8081 -e ME_CONFIG_OPTIONS_EDITORTHEME="ambiance" -e ME_CONFIG_MONGODB_SERVER="mongo" -e ME_CONFIG_MONGODB_AUTH_DATABASE="meandatabase" --link mongo mongo-express
```

#### Application

> Have Angular 13 Installed globally, and Node.JS 17 for the Backend.

Start the Node.JS Backend:

```
cd backend
DB_NAME=localhost ENV=development node server.js
```

Start the Angular Frontend:

```
ng serve
```

#### Building from source

For production release:

**Backend**

```
npm ci --only=production
```

**Frontend**

```
npm run build -- --configuration production
```
