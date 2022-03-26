const { Worker } = require('worker_threads');

const run = (instance, custom_id, custom_env = []) => {
  if (instance) {
    const worker = new Worker('./engine/worker.js', { workerData: { instance: JSON.parse(JSON.stringify(instance)), custom_id, custom_env } });

    worker.once('message', (result) => {
      console.log(`${result}`);
    });

    worker.on('error', (error) => {
      console.log(error);
    });

    worker.on('exit', (exitCode) => {
      console.log(`It exited with code ${exitCode}`);
    });
  }
};

const run_flow = async (flow, flow_run_id) => {
  const worker = new Worker('./engine/flower.js', { workerData: { flow: JSON.parse(JSON.stringify(flow)), flow_run_id } });

  worker.once('message', (result) => {
    console.log(`${result}`);
  });

  worker.on('error', (error) => {
    console.log(error);
  });

  worker.on('exit', (exitCode) => {
    console.log(`It exited with code ${exitCode}`);
  });
};

const run_flowviz = async (flowviz, flowviz_run_id) => {
  const worker = new Worker('./engine/flower-viz.js', { workerData: { flow: JSON.parse(JSON.stringify(flowviz)), flow_run_id: flowviz_run_id } });

  worker.once('message', (result) => {
    console.log(`${result}`);
  });

  worker.on('error', (error) => {
    console.log(error);
  });

  worker.on('exit', (exitCode) => {
    console.log(`It exited with code ${exitCode}`);
  });
};

function duration(t0, t1) {
  const d = (new Date(t1)) - (new Date(t0));
  const weekdays = Math.floor(d / 1000 / 60 / 60 / 24 / 7);
  const days = Math.floor(d / 1000 / 60 / 60 / 24 - weekdays * 7);
  const hours = Math.floor(d / 1000 / 60 / 60 - weekdays * 7 * 24 - days * 24);
  const minutes = Math.floor(d / 1000 / 60 - weekdays * 7 * 24 * 60 - days * 24 * 60 - hours * 60);
  const seconds = Math.floor(d / 1000 - weekdays * 7 * 24 * 60 * 60 - days * 24 * 60 * 60 - hours * 60 * 60 - minutes * 60);
  // let milliseconds = Math.floor(d               - weekdays*7*24*60*60*1000 - days*24*60*60*1000 - hours*60*60*1000 - minutes*60*1000 - seconds*1000);
  const t = {};
  // , 'milliseconds'
  ['weekdays', 'days', 'hours', 'minutes', 'seconds'].forEach((q) => { if (eval(q) > 0) { t[q] = eval(q); } });
  console.log(t);
  return t;
}

module.exports = {
  run, run_flow, run_flowviz, duration,
};
