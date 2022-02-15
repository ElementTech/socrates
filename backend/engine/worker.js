//add this script in myWorker.js file
const {parentPort, workerData} = require("worker_threads");
let Settings = require('../models/Settings');
var Docker = require('dockerode');
var docker = new Docker();
var stream = require('stream');
let DockerInstance = require('../models/DockerInstance');
const tmp = require('tmp');
const fs = require('fs');
dbConfig = require('../database/db');
var engine = require('./docker');

mongoose = require('mongoose'),
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

const lang = workerData.instance.block.lang.toLowerCase()
Settings.find((error, data) => {
  if (error) {
    console.log(error)
    throw error
  } else {
    docker.pull(`${data[0].langs.find(o => o.lang == lang).image}:${data[0].langs.find(o => o.lang == lang).tag}`, function (err, stream) {
      docker.modem.followProgress(stream, onFinished);
      function onFinished(err, output) {
        tmp.file(function _tempFileCreated(err, path, fd) {
          if (err) throw err;
          fs.writeFile(path, workerData.instance.block.script.replace(/^(?=\n)$|^\s*|\s*$|\n\n+/gm, ""), err => {
            if (err) {
              console.error(err)
              return
            }
              //
              if (workerData.instance.block.prescript == "" || workerData.instance.block.prescript == "false")
              {
                workerData.instance.block.prescript = "echo No Pre-Script"
              }
              if (workerData.custom_env){
                workerData.instance.parameters = workerData.custom_env
              }
              else
              {
                workerData.instance.parameters = workerData.instance.parameters.concat(workerData.instance.shared)
              }
              docker.createContainer({
                Image: `${data[0].langs.find(o => o.lang == lang).image}:${data[0].langs.find(o => o.lang == lang).tag}`,
                Env: workerData.instance.parameters.map(doc=>{
                  if (doc.key == "" || doc.value == "")
                  {
                    return `no_params=true`
                  }
                  return `${doc.key}=${doc.value}`
                }),
                HostConfig: {
                  AutoRemove: true,
                  Binds: [
                      `${require("path").dirname(path)}:/tmp`
                  ]
                }, 
                Cmd: ['sh','-c',`${workerData.instance.block.prescript.replace(/^(?=\n)$|^\s*|\s*$|\n\n+/gm, "")}; ${data[0].langs.find(o => o.lang == lang).command} /tmp/${require("path").basename(path)}`]//,"/socrates/"+require('path').basename(path)],
              }, function(err, container) {
                  container.start({}, function(err, data) {
                    create_docker_instance_in_database(
                      {
                        _id: workerData.custom_id,
                        parameters: workerData.instance.parameters,
                        container_id: container.id,
                        instance: workerData.instance._id,
                        console: [],
                        done:false
                      }
                    )
                    containerLogs(container,workerData.custom_id);
                  });
              });
          })
          // 'some-python-image', ['python', 'main.py', arg]
        
          
          // If we don't need the file anymore we could manually call the cleanupCallback
          // But that is not necessary if we didn't pass the keep option because the library
          // will clean after itself.
  
        });  
      }
     
    });
  }
})

function containerLogs(container,generated_id) {

    container.inspect(function (err, data) {
      const startTime = data["State"]["StartedAt"];
      const refreshTime = setInterval(function() {
  
        set_docker_instance_in_database(generated_id,
          {runtime: engine.duration(startTime,Date.now())}
        )
       
      }, 1000);
      // create a single stream for stdin and stdout
      var logStream = new stream.PassThrough();
      logStream.on('data', function(chunk){
        update_docker_instance_console_in_database(generated_id,
          { console: chunk.toString('utf8').replace("\n","") }
        )
      
      });
  
      container.logs({
        follow: true,
        stdout: true,
        stderr: true
      }, function(err, stream){
        if(err) {
          console.log(err)
        }
  
        const refreshTimeConnect = setInterval(function() {
  
          try {
            container.modem.demuxStream(stream, logStream, logStream);
            clearInterval(refreshTimeConnect)
          } catch (error) {
            console.log(error)
          }
        }, 1000);
        
  
        
        
        stream.on('end', function(){
       
       
          clearInterval(refreshTime);
        
          logStream.end('DONE');
            
            container.inspect(function (err, data) {
              const finishedAt = data["State"]["FinishedAt"];
              if (data.State.ExitCode != 0)
              {
                set_docker_instance_in_database(generated_id,
                  { done: true, error: true, runtime: duration(startTime,finishedAt) }
                )
              }
              else
              {
                set_docker_instance_in_database(generated_id,
                  { done: true, error: false, runtime: duration(startTime,finishedAt) }
                )
              }
            parentPort.postMessage("Done")

        
          });
      
        });
      });
  
    });
}
  
function create_docker_instance_in_database(docker_body){
DockerInstance.create(docker_body, (error, data) => {
if (error) {
    console.log(error)
} else {
    //run_id = data._id

}
})
}

function update_docker_instance_console_in_database(generated_id,docker_body) {
    DockerInstance.findByIdAndUpdate(generated_id, {
        $push: docker_body
    }, (error, data) => {
        if (error) {
        console.log(error)
        } else {

        }
    })
}

function set_docker_instance_in_database(generated_id,docker_body) {
    DockerInstance.findByIdAndUpdate(generated_id, {
      $set: docker_body
    }, (error, data) => {
      if (error) {
        console.log(error)
      } else {
        
      }
    })
}

function duration(t0, t1){
    let d = (new Date(t1)) - (new Date(t0));
    let weekdays     = Math.floor(d/1000/60/60/24/7);
    let days         = Math.floor(d/1000/60/60/24 - weekdays*7);
    let hours        = Math.floor(d/1000/60/60    - weekdays*7*24            - days*24);
    let minutes      = Math.floor(d/1000/60       - weekdays*7*24*60         - days*24*60         - hours*60);
    let seconds      = Math.floor(d/1000          - weekdays*7*24*60*60      - days*24*60*60      - hours*60*60      - minutes*60);
    //let milliseconds = Math.floor(d               - weekdays*7*24*60*60*1000 - days*24*60*60*1000 - hours*60*60*1000 - minutes*60*1000 - seconds*1000);
    let t = {};
    //, 'milliseconds'
    ['weekdays', 'days', 'hours', 'minutes', 'seconds'].forEach(q=>{ if (eval(q)>0) { t[q] = eval(q); } });
    return t;
}