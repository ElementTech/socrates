//add this script in myWorker.js file
const {parentPort, workerData} = require("worker_threads");
let Settings = require('../models/Settings');
let GithubElement = require('../models/GithubElement');
var Docker = require('dockerode');
var docker = new Docker();
var stream = require('stream');
let DockerInstance = require('../models/DockerInstance');
const tmp = require('tmp');
const fs = require('fs');
dbConfig = require('../database/db');
var engine = require('./docker');
const cupr = require('cup-readdir')

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
    docker.pull(`${data[0].langs.find(o => o.lang == lang).image}:${data[0].langs.find(o => o.lang == lang).tag}`,{'authconfig': data[0].docker_auth[0]}, function (err, stream) {
      docker.modem.followProgress(stream, onFinished);
      function onFinished(err, output) {
        tmp.file(function _tempFileCreated(err, path, fd) {
          if (err) throw err;
          tmp.dir(function _tempDirCreated(err, folder_path) {
            if (err) throw err;
            if (workerData.instance.block.github){
              if (data[0].github[0].githubConnected){
                GithubElement.findOne({path:workerData.instance.block.github_path},(error, git) => {
                  if ((git.content != null) && (git.content != undefined))
                  {
                    writeAndRun(path,folder_path,data=data,Buffer.from(git.content, 'base64').toString().replace(/^(?=\n)$|^\s*|\s*$|\n\n+/gm, ""))
                  }
                });
              }
              else
              {
                writeAndRun(path,folder_path,data=data,workerData.instance.block.script.replace(/^(?=\n)$|^\s*|\s*$|\n\n+/gm, ""))
              }
            }
            else
            {
              writeAndRun(path,folder_path,data=data,workerData.instance.block.script.replace(/^(?=\n)$|^\s*|\s*$|\n\n+/gm, ""))
            }
          });
        });  
      }
     
    });
  }
})

function writeAndRun(path,folder_path,data,script)
{
  fs.writeFile(path, script, err => {
    if (err) {
      console.error(err)
      return
    }
      //
      if (workerData.instance.block.prescript.replace(/^(?=\n)$|^\s*|\s*$|\n\n+/gm, "") == "" || workerData.instance.block.prescript.replace(/^(?=\n)$|^\s*|\s*$|\n\n+/gm, "") == "false")
      {
        workerData.instance.block.prescript = "echo No Pre-Script"
      }
 
      workerData.instance.parameters = workerData.instance.parameters.concat(workerData.instance.shared).concat(workerData.instance.multis).concat(workerData.instance.booleans).concat(workerData.custom_env.length != 0 ? workerData.custom_env : [])
  
      var auxContainer;
      docker.createContainer({
        Image: `${data[0].langs.find(o => o.lang == lang).image}:${data[0].langs.find(o => o.lang == lang).tag}`,
        Env: workerData.instance.parameters.map(doc=>{
          if (doc.key.toString() == "" || doc.value.toString() == "")
          {
            return `no_params=true`
          }
          return `${doc.key.toString()}=${doc.value}`
        }),
        WorkingDir: "/run",
        HostConfig: {
          AutoRemove: false,
          Binds: [
              `${require("path").dirname(path)}:/tmp`,
              `${folder_path}:/run`
          ]
        }, 
        Cmd: ['sh','-c',`${workerData.instance.block.prescript.replace(/^(?=\n)$|^\s*|\s*$|\n\n+/gm, "")}; ${data[0].langs.find(o => o.lang == lang).command} /tmp/${require("path").basename(path)}`]//,"/socrates/"+require('path').basename(path)],
      }).then(function(container) {
        auxContainer = container;
        return auxContainer.start()
      }).then(function(data) {
        create_docker_instance_in_database(
          {
            _id: workerData.custom_id,
            parameters: workerData.instance.parameters,
            container_id: auxContainer.id,
            instance: workerData.instance._id,
            console: [],
            output: [],
            done:false
          }
        )
        containerLogs(auxContainer,workerData.custom_id,folder_path);
      })
  })
}

function containerLogs(container,generated_id,folder_path) {

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
        chunkLine = chunk.toString('utf8').replace("\n","")
        if (chunkLine.includes("::set-output"))
        {
          console.log("Line Is",chunkLine)
          var str = chunkLine.split("::set-output ")[1];
          var index = str.indexOf('=');
          let keyval = [str.slice(0, index), str.slice(index + 1)]
          console.log(keyval)
          let key = keyval[0]
          let val = keyval[1]
          update_docker_instance_console_in_database(generated_id,
            { output: {"key":key,"value":val} }
          )
        }
        else
        {
          update_docker_instance_console_in_database(generated_id,
            { console: chunk.toString('utf8').replace("\n","") }
          )
        }
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

          container.inspect(async function (err, data) {
              const finishedAt = data["State"]["FinishedAt"];
              console.log(folder_path)
              cupr.getAllFilePaths(folder_path).then(files => {
                if (files.length != 0) {
                  console.log("Docker Run ID: " +generated_id)
                  console.log("Instance ID: " +workerData.instance._id)
                  var dir = require('path').join(__dirname, '..') + '/resources/artifacts/' + workerData.instance._id + "/" + generated_id;
                  if (!fs.existsSync(dir)) {
                    fs.mkdir(dir, { recursive: true }, (err) => {
                        if (err) throw err;
                        fs.cp(folder_path, dir, {recursive: true},(err)=>{
                          if (err) throw err;
                          if (data.State.ExitCode != 0)
                          {
                            set_docker_instance_in_database(generated_id,
                              { artifacts: files.map(file=>file.replace(folder_path + "/","")),done: true, error: true, runtime: (Object.keys(duration(startTime,finishedAt)).length != 0) ? duration(startTime,finishedAt) : { "seconds": 0 } }
                            )
                          }
                          else
                          {
                            set_docker_instance_in_database(generated_id,
                              { artifacts: files.map(file=>file.replace(folder_path + "/","")),done: true, error: false, runtime: (Object.keys(duration(startTime,finishedAt)).length != 0) ? duration(startTime,finishedAt) : { "seconds": 0 } }
                            )
                          }
                        });
                    });
                  }
                }
                else
                {
                  if (data.State.ExitCode != 0)
                  {
                    set_docker_instance_in_database(generated_id,
                      { artifacts: [],done: true, error: true, runtime: (Object.keys(duration(startTime,finishedAt)).length != 0) ? duration(startTime,finishedAt) : { "seconds": 0 } }
                    )
                  }
                  else
                  {
                    set_docker_instance_in_database(generated_id,
                      { artifacts: [],done: true, error: false, runtime: (Object.keys(duration(startTime,finishedAt)).length != 0) ? duration(startTime,finishedAt) : { "seconds": 0 } }
                    )
                  }
                }
                }
              )
           
              
              container.remove()
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