const Agenda = require("agenda");
const mongoose = require('mongoose');
const { Worker } = require('worker_threads');
const Instance = require('../models/Instance');
const CronRun = require('../models/CronRun');
const os = require('os');
const agenda = new Agenda({ 
  db: { address: require('../database/db').db },
  name: (os.hostname),
  maxConcurrency: 1000,
  defaultLockLifetime: 1500
  // defaultConcurrency: 1,
});

module.exports.agenda = agenda

module.exports.createInstance = function (interval, data) {

  agenda.define("instance-"+data.name,{shouldSaveResult:true}, (job,done) => {



    console.log("Running Scheduled " + "instance-"+data.name)
    const custom_id = new mongoose.Types.ObjectId().toHexString();
    const cron_id = new mongoose.Types.ObjectId().toHexString();
    job.attrs.data.run_id = custom_id
    create_cron_run_in_database({_id: cron_id, run_id: custom_id,component_id:data._id, type: "instance", job: "instance-"+data.name, done: false, error: false});
    job.save()
    Instance.findById(data._id.toString()).populate({
      path: 'block',
      model: 'Block', 
      }).exec((error, data)=> {
        if (error)
        {
          job.fail(error)
          done()
        }
        require('../engine/docker').run(data, custom_id);
        const worker = new Worker('./engine/watch.js', { 
          workerData: { 
            model: "DockerInstance", 
            id: custom_id, 
            field: "done"
          }
        });
        worker.once('message', (message) => {
          console.log(message)
          if (message)
          {
            set_cron_run_in_database(cron_id,{done:true,error:true})
            job.fail("Run Failed - " + custom_id)
            done()
          }
          else
          {
            set_cron_run_in_database(cron_id,{done:true,error:false})
            done()
          }
        });
       
    });

  });
  console.log("Running " + "instance-"+data.name + " at " + interval)
  agenda.every(interval, "instance-"+data.name,{
    "data":data,
    "type": "instance"
  });
};

module.exports.createStepFlow = function (interval, data) {
  agenda.define("step-"+data.name,{shouldSaveResult:true}, (job,done) => {
    console.log("Running Scheduled " + "step-"+data.name)
    const custom_id = new mongoose.Types.ObjectId().toHexString();
    const cron_id = new mongoose.Types.ObjectId().toHexString();
    job.attrs.data.run_id = custom_id
    create_cron_run_in_database({_id: cron_id, run_id: custom_id,component_id:data._id, type: "step", job: "step-"+data.name, done: false, error: false});
    job.save()    
    require('../engine/docker').run_flow(data, custom_id);
    const worker = new Worker('./engine/watch.js', { 
      workerData: { 
        model: "FlowInstance", 
        id: custom_id, 
        field: "done"
      }
    });
    worker.on('message', (message) => {
      if (message)
      {
        set_cron_run_in_database(cron_id,{done:true,error:true})
        job.fail("Run Failed - " + custom_id)
        done()
      }
      else
      {
        set_cron_run_in_database(cron_id,{done:true,error:false})
        done()
      }
    });
  });
  console.log("Running " + "step-"+data.name + " at " + interval)
  agenda.every(interval, "step-"+data.name,{
    "data":data,
    "type": "step"
  });
};

module.exports.createDagFlow = function (interval, data) {
  agenda.define("dag-"+data.name,{shouldSaveResult:true}, (job,done) => {
    console.log("Running Scheduled " + "dag-"+data.name)
    const custom_id = new mongoose.Types.ObjectId().toHexString();
    const cron_id = new mongoose.Types.ObjectId().toHexString();
    job.attrs.data.run_id = custom_id
    create_cron_run_in_database({_id: cron_id, run_id: custom_id,component_id:data._id, type: "dag", job: "dag-"+data.name, done: false, error: false});
    job.save()    
    require('../engine/docker').run_flowviz(data, custom_id);
    const worker = new Worker('./engine/watch.js', { 
      workerData: { 
        model: "FlowvizInstance", 
        id: custom_id, 
        field: "done"
      }
    });
    worker.on('message', (message) => {
      if (message)
      {
        set_cron_run_in_database(cron_id,{done:true,error:true})
        job.fail("Run Failed - " + custom_id)
        done()
      }
      else
      {
        set_cron_run_in_database(cron_id,{done:true,error:false})
        done()
      }
    });
  });
  console.log("Running " + "dag-"+data.name + " at " + interval)
  agenda.every(interval, "dag-"+data.name,{
    "data":data,
    "type": "dag"
  });
};



(async function () {
  await agenda.start();
  agenda.on('start', (job) => {
    console.log(time(), `Job <${job.attrs.name}> starting`);
  });
  agenda.on('success', (job) => {
    console.log(time(), `Job <${job.attrs.name}> succeeded`);
  });
  agenda.on('fail', (error, job) => {
    console.log(time(), `Job <${job.attrs.name}> failed:`, error);
  });
  agenda.on("error", (err, job) => {
    console.log(time(), `Job <${job.attrs.name}> error:`, err);
  });   
  agenda.on("complete", (job) => {
    console.log(`Job ${job.attrs.name} finished`);
  });  
  redefine()
  // Log job start and completion/failure

})();

async function redefine()
{
  const jobs = await agenda.jobs();
  jobs.forEach(job=>{
    switch (job.attrs.data.type) {
      case "instance":
        module.exports.createInstance(job.attrs.repeatInterval,job.attrs.data.data)
        break;
      case "step":
        module.exports.createStepFlow(job.attrs.repeatInterval,job.attrs.data.data)
        break;   
      case "dag":
        module.exports.createDagFlow(job.attrs.repeatInterval,job.attrs.data.data)
        break;          
      default:
        break;
    }
  })
}

function time() {
  return new Date().toTimeString().split(' ')[0];
}

function create_cron_run_in_database(body) 
{
  CronRun.create(body, (error, data) => {
    if (error) {
      console.log(error)
    }
  });
}

function set_cron_run_in_database(generated_id, body) {
  CronRun.findByIdAndUpdate(generated_id, {
    $set: body,
  }).exec()
}
