let express = require('express'),
   path = require('path'),
   mongoose = require('mongoose'),
   cors = require('cors'),
   bodyParser = require('body-parser'),
   dbConfig = require('./database/db');
const createError = require('http-errors');
const upsertMany = require('@meanie/mongoose-upsert-many');
const health = require('@cloudnative/health-connect');
const { Webhooks, createNodeMiddleware } = require("@octokit/webhooks");
const EventSource = require('eventsource')
const { Octokit } = require("@octokit/core");
let healthcheck = new health.HealthChecker();
mongoose.plugin(upsertMany);
// Connecting with mongo db
mongoose.Promise = global.Promise;
mongoose.connect(dbConfig.db, {
   useNewUrlParser: true
}).then(() => {
      
      console.log('Database sucessfully connected')
   },
   error => {
      console.log('Database could not connected: ' + error)
      process.exit(error)
   }
)
let Settings = require('./models/Settings');
const settingsRoute = require('./routes/settings.route');
const webhooks = new Webhooks({
   secret: "theeleusinianmysteries",
});
webhooks.onAny(({ id, name, payload }) => {
   console.log(name, "event received. Only watching push events.");
   Settings.find(async (error, data) => {
      if (error) {
        console.log(error)
      } else {
        const settings = data[0].github[0]
        if (settings.githubConnected){
           if (settings.githubWebhook)
           {
            if (name == "push" && (payload.ref.includes(settings.githubBranch)) && (payload.repository.full_name == settings.githubURL))
            {
               console.log("Legal Github Payload, Updating")
               const octokit = new Octokit({ auth: `${settings.githubToken}` });
               try {
                 const response = await octokit.request(`GET /repos/{owner}/{repo}/git/trees/{branch}?recursive=1`, {
                   owner: settings.githubURL.split("/")[0],
                   repo: settings.githubURL.split("/")[1],
                   branch: settings.githubBranch
                 })
                  const prefixList = data[0].langs.map(lang=>lang.type)
                  settingsRoute.updateGithubTree(response.data.tree,octokit,prefixList)
               } catch (error) {
                 console.log(error)
               }
            }
           }
        }
        else
        {
           console.log("Github Not Connected in Settings")
        }
      }
    })
});

const webhookProxyUrl = "https://smee.io/vK9sWLDceWSfSEe"; // replace with your own Webhook Proxy URL
const source = new EventSource(webhookProxyUrl);
source.onmessage = (event) => {
  const webhookEvent = JSON.parse(event.data);
  webhooks
    .verifyAndReceive({
      id: webhookEvent["x-request-id"],
      name: webhookEvent["x-github-event"],
      signature: webhookEvent["x-hub-signature"],
      payload: webhookEvent.body,
    })
    .catch(console.error);
};

// Setting up port with express js
const blockRoute = require('./routes/block.route')
const instanceRoute = require('./routes/instance.route')
const dockerRoute = require('./routes/docker.route');
const parameterRoute = require('./routes/parameter.route');
// const webRequestsRoute = require('../backend/routes/web-requests.route')
const flowRoute = require('./routes/flow.route');
const fileRoute = require('./routes/file.route');
const githubRoute = require('./routes/github.route');
// let Instances = require('./models/Instances');
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
   extended: false
}));
app.use(cors()); 
app.use(express.static(path.join(__dirname, 'dist/socrates')));
app.use('/', express.static(path.join(__dirname, 'dist/socrates')));
app.use('/live', health.LivenessEndpoint(healthcheck))
app.use('/ready', health.ReadinessEndpoint(healthcheck))
app.use('/health', health.HealthEndpoint(healthcheck))
app.use('/api/block', blockRoute)
app.use('/api/instance', instanceRoute)
app.use('/api/docker', dockerRoute)
app.use('/api/settings', settingsRoute.settingsRoute)
app.use('/api/flow', flowRoute)
app.use('/api/parameter', parameterRoute)
app.use('/api/file', fileRoute)
app.use('/api/github', githubRoute)
app.use(createNodeMiddleware(webhooks))
// app.use('/api/web', webRequestsRoute)



//Settings.create({"langs":{"python":{"image":"latest","command":"python"}}}, (error, data) => {
async function mySeeder() {
   const data = await Settings.find({}).exec();
   if (data.length !== 0) {
         // Data exists, no need to seed.
         return;
   }
   const seed = new Settings(
      {
         "langs":[
            {
               "lang": "python",
               "image": "python",
               "tag": "latest",
               "command":"python -u"
            },
            {
               "lang": "nodejs",
               "image": "node",
               "tag": "latest",
               "command":"node"
            },
            {
               "lang": "bash",
               "image": "ubuntu",
               "tag": "latest",
               "command":"sh"
            }
         ]
      }
   );

   // some other seed logic
   // ...

   await seed.save()
}


mySeeder();
// Create port
const port = process.env.PORT || 4000;
const server = app.listen(port, () => {
   console.log('Connected to port ' + port)
})

// Find 404 and hand over to error handler
app.use((req, res, next) => {
   next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  console.error(err.message); // Log error message in our server's console
  if (!err.statusCode) err.statusCode = 500; // If err has no specified error code, set error code to 'Internal Server Error (500)'
  res.status(err.statusCode).send(err.message); // All HTTP requests must have a response, so let's send back an error with its status code and message
});
