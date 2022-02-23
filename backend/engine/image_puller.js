const {parentPort, workerData} = require("worker_threads");
var Docker = require('dockerode');
const Settings = require("../models/Settings");
var docker = new Docker();
const images = workerData.images
const settings = workerData.settings
const id = workerData.id
dbConfig = require('../database/db');
mongoose = require('mongoose'),
mongoose.Promise = global.Promise;
mongoose.connect(dbConfig.db, {
   useNewUrlParser: true
}).then(() => {
      
    docker.listImages(function (err, result) {
        currentImages = result.map(item=>item.RepoTags? item.RepoTags[0] : '')
        images.forEach(image=>{
            if (!currentImages.includes(image))
            {
                console.log("Pulling "+image)
                docker.pull(image, function (err, stream) {
                    if (err)
                    {
                        Settings.findByIdAndUpdate(id,
                        {
                            $pull: {
                                langs: {image: image.split(":")[0],tag: image.split(":")[1]},
                            },
                        }, function(err, result){

                            if(err){
                                console.log(err)
                            }
                            else{
                                console.log(result)
                            }
                    
                        })
                    }
                })
            }
            else{
                console.log(image + " already exists")
            }
        })
    })
   },
   error => {
      console.log('Database could not connected: ' + error)
      process.exit(error)
   }
)




const deleteByPath = (object, path) => {
    let currentObject = object
    const parts = path.split(".")
    const last = parts.pop()
    for (const part of parts) {
      currentObject = currentObject[part]
      if (!currentObject) {
        return
      }
    }
    delete currentObject[last]
}

parentPort.postMessage("Syncronously Pulling")