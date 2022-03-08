const {Worker} = require("worker_threads");

const run = (instance,custom_id,custom_env=[]) => {

  const worker = new Worker("./engine/worker.js", {workerData: {instance:JSON.parse(JSON.stringify(instance)),custom_id:custom_id,custom_env:custom_env}});

  worker.once("message", result => {
      console.log(`${result}`);
  });
  
  worker.on("error", error => {
      console.log(error);
  });
  
  worker.on("exit", exitCode => {
      console.log(`It exited with code ${exitCode}`);
  })
}

const run_flow = async (flow,flow_run_id) => {
  
  const worker = new Worker("./engine/flower.js", {workerData: {flow: JSON.parse(JSON.stringify(flow)),flow_run_id: flow_run_id}});

  worker.once("message", result => {
      console.log(`${result}`);
  });
  
  worker.on("error", error => {
      console.log(error);
  });
  
  worker.on("exit", exitCode => {
      console.log(`It exited with code ${exitCode}`);
  })
}

const run_flowviz = async (flowviz,flowviz_run_id) => {
  
  const worker = new Worker("./engine/flower-viz.js", {workerData: {flow: JSON.parse(JSON.stringify(flowviz)),flow_run_id: flowviz_run_id}});

  worker.once("message", result => {
      console.log(`${result}`);
  });
  
  worker.on("error", error => {
      console.log(error);
  });
  
  worker.on("exit", exitCode => {
      console.log(`It exited with code ${exitCode}`);
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
  console.log(t)
  return t;
}

module.exports = {run, run_flow, run_flowviz, duration}