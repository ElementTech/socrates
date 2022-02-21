const express = require('express');
const app = express();
const webRequestsRoute = express.Router();
const fetch = require('node-fetch');

const auth = require("../middleware/auth");
webRequestsRoute.use(auth)

// Get All Blocks
webRequestsRoute.route('/langs').get((req, res) => {
  (async () => {
    const response = await fetch(
      `https://parseapi.back4app.com/classes/All_Programming_Languages`,
      {
        headers: {
          'X-Parse-Application-Id': 'XpRShKqJcxlqE5EQKs4bmSkozac44osKifZvLXCL', // This is the fake app's application id
          'X-Parse-Master-Key': 'Mr2UIBiCImScFbbCLndBv8qPRUKwBAq27plwXVuv', // This is the fake app's readonly master key
        }
      }
    );
    const data = await response.json(); // Here you have the data that you need
    res.json(JSON.stringify(data, null, 2))
  })();
})



module.exports = webRequestsRoute;