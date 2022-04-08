const swaggerAutogen = require('swagger-autogen')({openapi: '3.0.0'})
const mongoose = require('mongoose');
const m2s = require('mongoose-to-swagger');

function swaggerizeModel(mod)
{
    delete mod.properties.updatedAt
    delete mod.properties.createdAt
    delete mod.properties._id
    delete mod.properties.user
    return (({ title, properties }) => ({ type: 'object',properties:properties }))(mod)
}

var models = require('require-all')({
    dirname:  __dirname + '/models'
});

function objectMap(object, mapFn) {
    return Object.keys(object).reduce(function(result, key) {
        result[key] = mapFn(object[key])
        return result
    }, {})
}

models = objectMap(models, function(value) {
    return swaggerizeModel(m2s(value));
});

const doc = {
    info: {
      version: 'alpha',      // by default: '1.0.0'
      title: 'Socrates',        // by default: 'REST API'
      description: '',  // by default: ''
    },
    host: '',      // by default: 'localhost:3000'
    basePath: '',  // by default: '/'
    schemes: ['http','https'],   // by default: ['http']
    consumes: [],  // by default: ['application/json']
    produces: [],  // by default: ['application/json']
    tags: [        // by default: empty Array
      {
        name: '',         // Tag name
        description: '',  // Tag description
      },
      // { ... }
    ],
    securityDefinitions: {
        bearerAuth: {
          name: "Authorization",
          in: "header",
          type: "apiKey",
          description: "JWT Authorization header. Use /login to generate."
        }
    },
    security: [ { "bearerAuth": [] } ],
    definitions: {
    },          // by default: empty object (Swagger 2.0)
    components: {
        ...models
    }            // by default: empty object (OpenAPI 3.x)
};
const outputFile = './swagger/swagger.json'
const endpointsFiles = [
    './server.js'
]

swaggerAutogen(outputFile, endpointsFiles,doc).then(() => {
    // require('./server.js')
})