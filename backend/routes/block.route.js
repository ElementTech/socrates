const express = require('express');

const app = express();
const blockRoute = express.Router();

// Block model
const Block = require('../models/Block');
const Instance = require('../models/Instance');
const DockerInstance = require('../models/DockerInstance')
const auth = require('../middleware/auth');

blockRoute.use(auth);
// Add Block
blockRoute.route('/create').post((req, res, next) => {
  Block.create(Object.assign(req.body, { user: req.user._id }), (error, data) => {
    if (error) {
      res.status(400).json(error)
      return next(error)
    } 
      res.json(data)
    
  });
});

// Get All Blocks
blockRoute.route('/').get((req, res, next) => {
  Block.find({}).populate('user').exec((error, data) => {
    if (error) {
      return next(error)
    } 
      Instance.find((error,instances)=>{
        res.json(data.map(block=>
          ({...block.toJSON(),instance_count: instances.filter(instance=>instance.block==block._id).length})
        ))
      })
    
  });
});

// Get single block
blockRoute.route('/read/:id').get((req, res, next) => {
  Block.findById(req.params.id).populate('user').exec((error, data) => {
    if (error) {
      return next(error)
    } 
      res.json(data)
    
  });
});

// Update block
blockRoute.route('/update/:id').put((req, res, next) => {
  Block.findByIdAndUpdate(req.params.id, {
    $set: req.body,
  }, (error, data) => {
    if (error) {
      res.status(400).json(error)
      return next(error);
    } 
      Instance.find({ 
        block:req.params.id
      }, (err, docs) => {
         if(err){
             console.log(`Error: ` + err)
         } else{
           if(docs.length === 0){
               console.log("no instances to update")
           } else{
              docs.forEach(inst => {
                let tempParams=inst.parameters
                let tempShared=inst.shared
                let tempBool=inst.booleans
                let tempMulti=inst.multis
                let tempDynamic=inst.dynamic
                inst.parameters.forEach(param=>{
                  if (!req.body.parameters.map(bparam=>bparam.key).includes(param.key))
                  {
                    tempParams = tempParams.filter(item => item.key !== param.key)
                  }
                })
                req.body.parameters.forEach(bparam=>{
                  if (!tempParams.map(param=>param.key).includes(bparam.key))
                  {
                    tempParams.push(bparam)
                  }
                })
                inst.shared.forEach(param=>{
                  if (!req.body.shared.map(bparam=>bparam.key).includes(param.key))
                  {
                    tempShared = tempShared.filter(item => item.key !== param.key)
                  }
                })
                req.body.shared.forEach(bparam=>{
                  if (!tempShared.map(param=>param.key).includes(bparam.key))
                  {
                    tempShared.push(bparam)
                  }
                })           
                inst.booleans.forEach(param=>{
                  if (!req.body.booleans.map(bparam=>bparam.key).includes(param.key))
                  {
                    tempBool = tempBool.filter(item => item.key !== param.key)
                  }
                })
                req.body.booleans.forEach(bparam=>{
                  if (!tempBool.map(param=>param.key).includes(bparam.key))
                  {
                    tempBool.push(bparam)
                  }
                })           
                inst.multis.forEach(param=>{
                  if (!req.body.multis.map(bparam=>bparam.key).includes(param.key))
                  {
                    tempMulti = tempMulti.filter(item => item.key !== param.key)
                  }
                })
                req.body.multis.forEach(bparam=>{
                  if (!tempMulti.map(param=>param.key).includes(bparam.key))
                  {
                    bparam.value = bparam.value.split(",")[0]
                    tempMulti.push(bparam)
                  }
                })    
                inst.dynamic.forEach(param=>{
                  if (!req.body.dynamic.map(bparam=>bparam.name).includes(param.name))
                  {
                    tempDynamic = tempDynamic.filter(item => item.name !== param.name)
                  }
                })
                req.body.dynamic.forEach(bparam=>{
                  if (!tempDynamic.map(param=>param.name).includes(bparam.name))
                  {
                    tempDynamic.push(bparam)
                  }
                })   
                
                Instance.findOneAndUpdate({
                    _id: inst._id,
                }, {
                    parameters: tempParams,
                    shared: tempShared,
                    booleans: tempBool,
                    multis: tempMulti,
                    dynamic: tempDynamic
                }, (err, doc) => {
                    if (err) {
                        console.log(`Error: ` + err)
                    } else {
                        console.log("Updated relevant instances")
                    }
                });
             });
           }
         }
      });
      res.json(data)
      console.log('Data updated successfully')
    
  });
});

// Delete block
blockRoute.route('/delete/:id').delete((req, res, next) => {
  Instance.find({ block: req.params.id }).exec((error,instance_data)=> {
    if (error) {
      res.status(500).json({
        msg: error,
      });
      return next(error);
    } else if (instance_data.length == 0){
        Block.findByIdAndRemove(req.params.id, (error, data) => {
          console.log("Removing: " + req.params.id)
          if (error) {
            res.status(500).json({
              msg: error
            })
            return next(error);
          } else {
            res.status(200).json({
              msg: data
            })
          }
        })
      }
      else
      {
        res.status(406).json({
          msg: "Block Has Instances Attached"
        })
      }
  });
});

// Get All Dockers stats of a specific instance ID
blockRoute.route('/stats/:id').get((req, res, next) => {
  Instance.find({ block: req.params.id }).exec((error,instances)  => {
    if (error) {
      return next(error);
    } else {
      let numFail = 0;
      let numSuccess = 0;
      let avgRun = 0;
      const runs = []
      let runsLength = 0;
      let instancesCount = 0;
      instances.forEach((elementInstance) => {
        instancesCount++;

        DockerInstance.find({ instance: elementInstance._id }).exec((error,data) => {
          if (error) {
            return next(error);
          } else if (data.length == 0)
              {
                instancesCount--
              }
              else
              {
                runsLength += data.length
              
                data.forEach(element => {
                  if (element.done == true){
                    if (element.error){
                      numFail++
                    }
                    else
                    {
                      numSuccess++
                    }
                    let tempTimeSeconds = 0
                    for (const key in element.runtime) {
                        const timeElement = element.runtime[key];
                        if (key == "seconds"){
                          avgRun+=timeElement
                          tempTimeSeconds+=timeElement
                        }
                        if (key == "minutes"){
                          avgRun+=timeElement*60
                          tempTimeSeconds+=timeElement*60
                        }
                        if (key == "hours"){
                          avgRun+=timeElement*60*60
                          tempTimeSeconds+=timeElement*60*60
                        }
                        if (key == "days"){
                          avgRun+=timeElement*24*60*60
                          tempTimeSeconds+=timeElement*24*60*60
                        }
                        if (key == "weekdays"){
                          avgRun+=timeElement*7*24*60*60
                          tempTimeSeconds+=timeElement*7*24*60*60
                        }
                    }
                    runs.push({"name":data.indexOf(element),"value":tempTimeSeconds,"instance": elementInstance.name})  
  
                    if (runs.length == runsLength){
                      instancesCount--
                      if (instancesCount == 0){
                        
                        res.json({"fail": numFail,"success":numSuccess,"avg":secondsToHms(avgRun/runs.length),"runs":runs})
                      }
                    } 
                  }
                  
                });
              }    

        });
      });
    }
  });
});

function secondsToHms(d) {
  d = Number(d);
  let w = Math.floor(d / 604800);
  let y = Math.floor(d / 86400);
  let h = Math.floor(d / 3600);
  let m = Math.floor(d % 3600 / 60);
  let s = Math.floor(d % 3600.0 % 60.0);
  let wDisplay = w > 0 ? w + (w == 1 ? ' week, ' : ' weeks, ') : '';
  let yDisplay = y > 0 ? y + (y == 1 ? ' day, ' : ' days, ') : '';
  let hDisplay = h > 0 ? h + (h == 1 ? ' hour, ' : ' hours, ') : '';
  let mDisplay = m > 0 ? m + (m == 1 ? ' minute, ' : ' minutes, ') : '';
  let sDisplay = s > 0 ? s + (s == 1 ? ' second' : ' seconds') : '';
  return wDisplay + yDisplay + hDisplay + mDisplay + sDisplay;
}

module.exports = blockRoute;
