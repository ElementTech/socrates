var Minio = require('minio')

module.exports = {
    minioClient: minioConnect()
};

function minioConnect()
{

   var minioClient = new Minio.Client({
       endPoint: process.env.MINIO_ADDR ? process.env.MINIO_ADDR : "127.0.0.1",
       port: process.env.MINIO_PORT ? process.env.MINIO_PORT : 9000,
       useSSL: process.env.MINIO_SSL != undefined ? process.env.MINIO_SSL : false,
       accessKey: process.env.MINIO_ACCESS_KEY ? process.env.MINIO_ACCESS_KEY : 'AKIAIOSFODNN7EXAMPLE',
       secretKey: process.env.MINIO_SECRET_KEY ? process.env.MINIO_SECRET_KEY : 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY'
   });

   return minioClient
}

