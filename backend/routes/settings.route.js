const express = require('express');

const app = express();
const settingsRoute = express.Router();
const { Octokit } = require('@octokit/core');
const path = require('path');
const { Worker } = require('worker_threads');
// Settings model
const Settings = require('../models/Settings');
const GithubElement = require('../models/GithubElement');
const auth = require('../middleware/auth');
const yaml = require('js-yaml');
const Block = require('../models/Block');
const Instance = require('../models/Instance');
const Flow = require('../models/Flow');
const Flowviz = require('../models/Flowviz');
const Parameter = require('../models/Parameter');
const Dynamic = require('../models/DynamicParameter');
settingsRoute.use(auth);
// Add Settings
settingsRoute.route('/create').post((req, res, next) => {

    /*	#swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        $ref: "#/components/Settings"
                    }  
                }
            }
    } */


  Settings.create(req.body, (error, data) => {
    if (error) {
      return next(error);
    }
    res.json(data);
  });
});

// Get All Settingss
settingsRoute.route('/').get((req, res) => {
  Settings.find((error, data) => {
    if (error) {
      return next(error);
    }
    res.json(data);
  });
});

// Get single settings
settingsRoute.route('/read/:id').get((req, res) => {
  Settings.findById(req.params.id, (error, data) => {
    if (error) {
      return next(error);
    }
    res.json(data);
  });
});

// testGithubConnection(repoURL){

// }

function getExt(str) {
  const basename = path.basename(str);
  const firstDot = basename.indexOf('.');
  const lastDot = basename.lastIndexOf('.');
  const extname = path.extname(basename).replace(/(\.[a-z0-9]+).*/i, '$1');
  if (firstDot === lastDot) {
    return extname;
  }

  return basename.slice(firstDot, lastDot) + extname;
}

function process_github_element(blobdata,item,prefixList,prefix) {
  if ((blobdata.data.content == '') || (blobdata.data.content == null) || (!prefixList.includes(prefix))) {
    GithubElement.find({ path: item.path }).remove().exec();
    return false
  } else {
    GithubElement.updateOne({ path: item.path }, { prefix, content: blobdata.data.content, sha: item.sha,size:item.size }, { upsert: true }).exec();
    return true
  }
}

function addBlockFromGit(doc,git_settings,tree,octokit)
{
  const shared = doc.parameters.filter((p)=>p["type"]=='shared').map(async (p)=>{
    if (git_settings.sharedParams)
    {
      await Parameter.updateOne({key:p["key"]},p,{upsert:true}).exec()
      return p
    }
    else
    {
      const paramExists = await Parameter.find({key:p["key"]}).exec()
      if (paramExists.length != 0)
      {
        return p
      }
      else
      {
        return false
      }
    }
  })
  const dynamic = doc.parameters.filter((p)=>p["type"]=='dynamic').map(async (p)=>{
    delete Object.assign(p, {["name"]: p["key"] })["key"];
    delete Object.assign(p, {["script"]: p["value"] })["value"];
    if (git_settings.dynamicParams)
    {
      await Dynamic.updateOne({name:p["name"]},p,{upsert:true}).exec()
      return p
    }
    else
    {
      const paramExists = await Dynamic.find({name:p["name"]}).exec()
      if (paramExists.length != 0)
      {
        return p
      }
      else
      {
        return false
      }
    }
  })
  return Promise.all([
    shared,dynamic
  ].flat()).then(output=>{
    return Block.updateOne({name: doc.name},{
      lang: doc.lang,
      parameters: doc.parameters.filter(p=>p["type"]=='text'),
      booleans: doc.parameters.filter(p=>p["type"]=='bool'),
      multis: doc.parameters.filter(p=>p["type"]=='multi').map(p=>{
        p["value"] = p["value"].join(",")
        return p
      }),
      shared: output.filter(p=>p['type']=='shared'),
      dynamic: output.filter(p=>p['type']=='dynamic'),
      script: (doc.script.github != undefined) ? ((tree.filter(item=>item.path==doc.script.github) != 0) ? (tree.filter(item=>item.path==doc.script.github).map(async (item)=>{
        const blobdata = await octokit.request('GET {url}', {url: item.url});
        return Object.assign(item,{blobdata:blobdata})
      }))[0].blobdata : doc.script.code) : doc.script.code,
      github: (doc.script.github != undefined) ? true : false,
      github_path: (doc.script.github != undefined) ? doc.script.github : '',
      prescript: doc.prescript.enabled ? doc.prescript.script : false,
      desc: doc.desc,
      image: doc.image
    }, { upsert: true }).exec();
  })
}

async function addInstanceFromGit(doc,blockData)
{
  return Instance.updateOne({name: doc.name},{
    parameters: blockData.parameters.map(p=>{
      let instanceOverride = doc.parameters.filter(param=>(param["type"]=='text') && (param["key"] == p["key"]))
      if (instanceOverride.length!=0)
      {
        p["value"] = instanceOverride[0]["value"]
      }
      return p
    }),
    booleans: blockData.booleans.map(p=>{
      let instanceOverride = doc.parameters.filter(param=>(param["type"]=='bool') && (param["key"] == p["key"]))
      if (instanceOverride.length!=0)
      {
        p["value"] = instanceOverride[0]["value"]
      }
      return p
    }),
    multis: blockData.multis.map(p=>{
      let instanceOverride = doc.parameters.filter(param=>(param["type"]=='multi') && (param["key"] == p["key"]))
      if (instanceOverride.length!=0)
      {
        p["value"] = instanceOverride[0]["value"]
      }
      return p
    }),
    block: blockData._id,
    shared: blockData.shared.map(p=>{
      delete p["$setOnInsert"]
      return p
    }),
    dynamic: blockData.dynamic.map(p=>{
      delete p["$setOnInsert"]
      return p
    }),
    desc: doc.desc,
    image: doc.image
  }, { upsert: true }).exec();
}

async function verifyInstanceAndCreateFromGit(doc,git_settings,tree,octokit)
{
  const blockExists = tree.map(async (item)=>{
    if (item.path.includes(".block.yaml"))
    {
      const temp_blob = await octokit.request('GET {url}', {
        url: item.url,
      });
      let tempBlock = yaml.load(Buffer.from(temp_blob.data.content, 'base64').toString());
      if (doc.block == tempBlock["name"])
      {
        return tempBlock
      }
    }
    return false
  })
  const blockExistsDB = await Block.find({name:doc.block}).exec()
  return Promise.all([
    blockExists,
    blockExistsDB
  ].flat()).then(async (output)=>{
    output = output.filter(item=>item)
    switch (output.length) {
      case 1:
        if (Object.keys(output[0]).includes("_id"))
        {
          // this is mongo
          return addInstanceFromGit(doc,output[0])
        }
        else
        {
          // this is git
          const res = addBlockFromGit(output[0],git_settings,tree,octokit)
          return res.then(async (output)=>{
            const blockData = await Block.find({name:doc.block}).exec()
            return addInstanceFromGit(doc,blockData[0])
          })
        }
        break;
      case 2:
        if (Object.keys(output[0]).includes("_id"))
        {
          // first is mongo
          return addInstanceFromGit(doc,output[0])
        }
        else
        {
          // first is git
          return addInstanceFromGit(doc,output[1])
        }            
        break;        
      default:
        break;
    }
  });
}

function recursiveNodeFlattening(nodes,num=1,parent="")
{
  return nodes.map(node=>{
    let tempId = "node" + num.toString()
    let tempLabel = num.toString()
    let tempData = {name:node.name}
    num = num+1
    if (Object.keys(node).includes("children"))
    {
      return [{id:tempId,label:tempLabel,data:tempData,parent:parent}].concat(recursiveNodeFlattening((node.children instanceof Array) ? node.children : [node.children],num+1,tempId))
    }
    else
    {
      return {id:tempId,label:tempLabel,data:tempData,parent:parent}
    }
  })
}

function recursiveLinkFlattening(nodes)
{
  let links = []
  nodes.forEach(node=>{
    if (node.parent != '')
    {
      links.push({id:node.id,label:node.id.replace("node",""),source:node.parent,target:node.id})
    }
  })
  return links
}

async function addComponent(blobdata,item,tree,octokit)
{
  let git_settings = await Settings.find({}).exec()
  git_settings = git_settings[0].github[0]
  const doc = yaml.load(Buffer.from(blobdata.data.content, 'base64').toString());
  switch (path.basename(item.path).split(".")[1]) {
    case "block":
      addBlockFromGit(doc,git_settings,tree,octokit)
      break;
    case "instance":
      verifyInstanceAndCreateFromGit(doc,git_settings,tree,octokit)
      break;
    case "step":
      const translatedSteps = doc.steps.map(step=>{
        let num = -1
        return step.map(async (inst)=>{
          const instanceExists = tree.map(async (item)=>{
            if (item.path.includes(".instance.yaml"))
            {
              const temp_blob = await octokit.request('GET {url}', {
                url: item.url,
              });
              let tempBlock = yaml.load(Buffer.from(temp_blob.data.content, 'base64').toString());
              if (inst.name == tempBlock["name"])
              {
                return tempBlock
              }
            }
            return false
          })
          const instanceExistsDB = await Instance.find({name:inst.name}).exec()
          return Promise.all([
            instanceExists,
            instanceExistsDB
          ].flat()).then(async (output)=>{
            output = output.filter(item=>item)
            switch (output.length) {
              case 1:
                if (Object.keys(output[0]).includes("_id"))
                {
                  // this is mongo
                  num = num + 1
                  return {num: num, id: output[0]._id};
                }
                else
                {
                  // this is git
                  const res = verifyInstanceAndCreateFromGit(output[0],git_settings,tree,octokit)
                  return res.then(async (output)=>{
                    const instData = await Instance.find({name:inst.name}).exec()
                    num = num + 1
                    return {num: num, id: instData[0]._id};
                  })
                }
                break;
              case 2:
                if (Object.keys(output[0]).includes("_id"))
                {
                  // first is mongo
                  num = num + 1
                  return {num: num, id: output[0]._id};
                }
                else
                {
                  // first is git
                  num = num + 1
                  return {num: num, id: output[1]._id};
                }            
                break;        
              default:
                break;
            }
          });
        })
      })
      Promise.all(translatedSteps.map(function(entity){
        return Promise.all(entity)
      })).then(function(data) {
        if (!data.flat().flat().includes(undefined))
        {
          Flow.updateOne({name: doc.name},{
            steps: data,
            on_error: doc.on_error,
            desc: doc.desc,
            image: doc.image
          }, { upsert: true }).exec();
        }
      });
      break;               
    case "dag":
      const nodes = [{id:"node0",label:"Start",parent:''}].concat(recursiveNodeFlattening(doc.nodes,1,"node0")).flat(Infinity)
      const links = recursiveLinkFlattening(nodes)
      Flowviz.updateOne({name: doc.name},{
        nodes: nodes,
        links: links,
        on_error: doc.on_error,
        desc: doc.desc,
        image: doc.image
      }, { upsert: true }).exec();
      break;                 
    default:
      break;
  }
}

async function updateGithubTree(tree, octokit, prefixList) {
  let git_settings = await Settings.find({}).exec()
  git_settings = git_settings[0].github[0]

  tree.forEach(async (item) => {
    const blobdata = await octokit.request('GET {url}', {
      url: item.url,
    });
    const prefix = getExt(item.path);
    if (!prefix.includes(".yaml"))
    {
      process_github_element(blobdata,item,prefixList,prefix)
    }
    else
    {
      if (process_github_element(blobdata,item,[".yaml"],".yaml") && git_settings["allowComponents"])
      {
        addComponent(blobdata,item,tree,octokit)
      }
    }
  });
  GithubElement.find((error, data) => {
    if (error) {
      console.log(error);
    } else {
      data.forEach(async (item) => {
        if (!tree.find((gitelement) => gitelement.path === item.path)) {
          const removedElement = await GithubElement.find({ path: item.path }).exec();
          await GithubElement.find({ path: item.path }).remove().exec()
          console.log(removedElement)
          const prefix = getExt(item.path);
          if (git_settings.removeComponents)
          {
            if (prefix.includes(".yaml"))
            {
              const removedName = yaml.load(Buffer.from(removedElement[0].content, 'base64').toString())["name"];
              switch (path.basename(item.path).split(".")[1]) {
                case "block":
                  Block.find({ name: removedName }).remove().exec();
                  break;
                case "instance":
                  Instance.find({ name: removedName }).remove().exec();
                  break;     
                case "step":
                  Flow.find({ name: removedName }).remove().exec();
                  break;
                case "dag":
                  Flowviz.find({ name: removedName }).remove().exec();
                  break;      
                default:
                  break;
              }
            }
          }
        }
      });
    }
  });
}

// Update settings
settingsRoute.route('/update/:id').put(async (req, res, next) => {
  if (Object.keys(req.body).includes('github')) {
    // https://api.github.com/repos/[USER]/[REPO]/git/trees/[BRANCH]?recursive=1
    if (req.body.github.githubConnected == false) {
      updateSetting(req.params.id, req.body, res, next);
      pullImages(req.body.langs, req.body, req.params.id, req.body.docker_auth);
    } else {
      const octokit = new Octokit({ auth: `${req.body.github.githubToken}` });
      try {
        const response = await octokit.request('GET /repos/{owner}/{repo}/git/trees/{branch}?recursive=1', {
          owner: req.body.github.githubURL.split('/')[0],
          repo: req.body.github.githubURL.split('/')[1],
          branch: req.body.github.githubBranch,
        });
        updateSetting(req.params.id, req.body, res, next);
        res.json('Github Connection Succesful');
        Settings.find({}, (error, data) => {
          const prefixList = data[0].langs.map((lang) => lang.type);
          updateGithubTree(response.data.tree, octokit, prefixList);
          Settings.findByIdAndUpdate(data[0]._id, {
            $set: {
              github: [
                {
                  githubToken: req.body.github.githubToken,
                  githubURL: req.body.github.githubURL,
                  githubBranch: req.body.github.githubBranch,
                  githubWebhook: req.body.github.githubWebhook,
                  githubConnected: req.body.github.githubConnected,
                  allowComponents: req.body.github.allowComponents,
                  removeComponents: req.body.github.removeComponents,
                  sharedParams: req.body.github.sharedParams,
                  dynamicParams: req.body.github.dynamicParams,
                  sha: response.data.sha,
                },
              ],
            },
          }).exec();
        });
      } catch (error) {
        console.log(error);
        res.json(`Error ${error.status}: ${error.response.data.message}`);
      }
    }
  } else {
    updateSetting(req.params.id, req.body, res, next);
    pullImages(req.body.langs, req.body, req.params.id, req.body.docker_auth);
  }
});

function pullImages(langs, settings, id, auth) {
  const worker = new Worker('./engine/image_puller.js', {
    workerData: {
      images: langs.map((item) => `${item.image}:${item.tag}`), settings, id, auth,
    },
  });

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

function updateSetting(id, body, res, next) {
  Settings.findByIdAndUpdate(id, {
    $set: body,
  }, (error, data) => {
    if (error) {
      return next(error);
    }
    console.log('Data updated successfully');
  });
}

// Delete settings
settingsRoute.route('/delete/:id').delete((req, res, next) => {
  Settings.findByIdAndRemove(req.params.id, (error, data) => {
    console.log(`Removing: ${req.params.id}`);
    if (error) {
      return next(error);
    }
    res.status(200).json({
      msg: data,
    });
  });
});

module.exports = { settingsRoute, updateGithubTree };
