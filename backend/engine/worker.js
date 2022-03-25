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
const lang = workerData.instance.block.lang.toLowerCase()
var minioClient = require('../database/minio').minioClient
mongoose = require('mongoose'),
mongoose.Promise = global.Promise;
mongoose.connect(dbConfig.db, {
   useNewUrlParser: true,
reconnectTries: Number.MAX_VALUE,
reconnectInterval: 500,
connectTimeoutMS: 20000,
socketTimeoutMS: 45000
}).then(() => {
      console.log('Database sucessfully connected')
Array.prototype.unique = function() {
  var a = this.concat();
  for(var i=0; i<a.length; ++i) {
      for(var j=i+1; j<a.length; ++j) {
          if(a[i]["key"] === a[j]["key"])
              a.splice(j--, 1);
      }
  }

  return a;
};
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
   },
   error => {
      console.log('Database could not connected: ' + error)
      process.exit(error)
   }
)

function writeAndRun(path,folder_path,data,script)
{
  fs.writeFile(path, script, err => {
    if (err) {
      console.error(err)
    }
      console.log("here")
      // Using fPutObject API upload your file to the bucket tmp.
      minioClient.fPutObject('tmp', require("path").basename(path), path, function(err, etag) {
        if (err)
        { 
          console.log(err)
        }
        console.log('File uploaded successfully. ' + etag)
        //

        docker.pull('d3fk/s3cmd',function (err, stream) {
          if (err)
          { 
            console.log(err)
          }
          docker.modem.followProgress(stream, onFinished);
          function onFinished(err, output) {
            console.log(err,output)
            docker.run('d3fk/s3cmd', [
              "--force",
              `--access_key=${process.env.MINIO_ACCESS_KEY ? process.env.MINIO_ACCESS_KEY : 'AKIAIOSFODNN7EXAMPLE'}`,
              `--secret_key=${process.env.MINIO_SECRET_KEY ? process.env.MINIO_SECRET_KEY : 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY'}`,
              "--signature-v2",
              "--no-ssl",
              `--host=${process.env.MINIO_ADDR ? process.env.MINIO_ADDR : "127.0.0.1"}:${process.env.MINIO_PORT ? process.env.MINIO_PORT : "9000"}`,
              `--host-bucket=${process.env.MINIO_ADDR ? process.env.MINIO_ADDR : "127.0.0.1"}:${process.env.MINIO_PORT ? process.env.MINIO_PORT : "9000"}`,
              `--region=us-east-1`,
              "get",
              `s3://tmp/${require("path").basename(path)}`
            ], process.stdout, {
              WorkingDir: "/tmp",
              HostConfig: {
                AutoRemove: false,
                Binds: [
                    `${require("path").dirname(path)}:/tmp`
                ],
                NetworkMode: 'host'
              }
            }, function(err, data_s3, container) {
              if (err){
                console.error(err);
              }
              continueLogs(container)

              function continueLogs(container) {
                container.logs({
                  follow: true,
                  stdout: true,
                  stderr: true
                }, function(err, stream){
                  if(err) {
                    console.error(err);
                  }
                  container.modem.demuxStream(stream);
                  stream.on('end', function(){
                    if (workerData.instance.block.prescript.replace(/^(?=\n)$|^\s*|\s*$|\n\n+/gm, "") == "" || workerData.instance.block.prescript.replace(/^(?=\n)$|^\s*|\s*$|\n\n+/gm, "") == "false")
                    {
                      workerData.instance.block.prescript = "echo No Pre-Script"
                    }
                    console.log((workerData.custom_env.length != 0 ? workerData.custom_env : []))
                    workerData.instance.parameters = 
                    (workerData.custom_env.length != 0 ? workerData.custom_env : [])
                    .concat(workerData.instance.parameters)
                    .concat(workerData.instance.shared)
                    .concat(workerData.instance.multis)
                    .concat(workerData.instance.booleans)
                    .concat(workerData.instance.dynamic != undefined ? (workerData.instance.dynamic != 0 ? workerData.instance.dynamic.map(dynamo=>{return {"key":dynamo.name,"value":dynamo.output}}) : []) : [])
                    .unique()
                
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
                      Volumes: {
                        '/run': {}
                      },
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
                  });
                });
              }

             

            });
            

          }
        })




      });

  })
}

function containerLogs(container,generated_id,folder_path) {

    container.inspect(function (err, data) {
      if (err)
      {
        console.error(err);
      }
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
          console.error(err);
        }
        const refreshTimeConnect = setInterval(function() {
          try {
            container.modem.demuxStream(stream, logStream, logStream);
            clearInterval(refreshTimeConnect)
          } catch (error) {
            console.error(err);
          }
        }, 1000);
        stream.on('end', function(){
          clearInterval(refreshTime);
          logStream.end('DONE');

          container.inspect(async function (err, data) {
              const finishedAt = data["State"]["FinishedAt"];
              console.error(err);
              console.log(folder_path)






              docker.run('d3fk/s3cmd', [
                "--force",
                `--access_key=${process.env.MINIO_ACCESS_KEY ? process.env.MINIO_ACCESS_KEY : 'AKIAIOSFODNN7EXAMPLE'}`,
                `--secret_key=${process.env.MINIO_SECRET_KEY ? process.env.MINIO_SECRET_KEY : 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY'}`,
                "--signature-v2",
                "--no-ssl",
                `--host=${process.env.MINIO_ADDR ? process.env.MINIO_ADDR : "127.0.0.1"}:${process.env.MINIO_PORT ? process.env.MINIO_PORT : "9000"}`,
                `--host-bucket=${process.env.MINIO_ADDR ? process.env.MINIO_ADDR : "127.0.0.1"}:${process.env.MINIO_PORT ? process.env.MINIO_PORT : "9000"}`,
                `--region=us-east-1`,
                "sync",
                "./",
                `s3://artifacts/${workerData.instance._id}/${generated_id}/`
              ], process.stdout, {
                WorkingDir: "/run",
                HostConfig: {
                  AutoRemove: false,
                  Binds: [
                      `${folder_path}:/run`
                  ],
                  NetworkMode: 'host'
                }
              }, function(err, data_s3, container) {
                if (err){
                  console.error(err);
                }
                continueLogs(container)
  
                function continueLogs(container) {
                  container.logs({
                    follow: true,
                    stdout: true,
                    stderr: true
                  }, function(err, stream){
                    if(err) {
                        console.log(err)
                    }
                    container.modem.demuxStream(stream);
             
                    stream.on('end', function(){

                      var minioStream = minioClient.listObjects('artifacts','', true)
                      var artifacts = []
                      minioStream.on('data', function(obj) { 
                        obj = obj["name"].split("/")
                        if ( (obj[0]==workerData.instance._id) && (obj[1]==generated_id) )
                        {
                          artifacts.push(obj[2])
                        }
                      })
                      minioStream.on("end", function (obj) { 
                        console.log("artifacts",artifacts)
                        set_docker_instance_in_database(generated_id,
                          { artifacts: artifacts,done: true, error: ((data.State.ExitCode!=0) ? true : false), runtime: (Object.keys(duration(startTime,finishedAt)).length != 0) ? duration(startTime,finishedAt) : { "seconds": 0 } }
                        )
                      })
                    });
                  });
                }
              });

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