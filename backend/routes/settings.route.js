const express = require('express');
const app = express();
const settingsRoute = express.Router();
const { Octokit } = require("@octokit/core");
const path = require('path');
// Settings model
let Settings = require('../models/Settings');
const GithubElement = require('../models/GithubElement');

// Add Settings
settingsRoute.route('/create').post((req, res, next) => {
  Settings.create(req.body, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
});

// Get All Settingss
settingsRoute.route('/').get((req, res) => {
  Settings.find((error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})

// Get single settings
settingsRoute.route('/read/:id').get((req, res) => {
  Settings.findById(req.params.id, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})

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

function updateGithubTree(tree,octokit,prefixList){
  tree.forEach(async item=>{
    let blobdata = await octokit.request(`GET {url}`, {
      url: item.url
    })
    const prefix = getExt(item.path)
    if ((blobdata.data.content == '') || (blobdata.data.content == null) || (!prefixList.includes(prefix)))
    {
      GithubElement.find({"path": item.path}).remove().exec();
    }
    else
    {
      GithubElement.updateOne({"path": item.path},{"prefix":prefix,"content":blobdata.data.content},{upsert: true}).exec()
    }
  })
}

// Update settings
settingsRoute.route('/update/:id').put(async (req, res, next) => {
  if (Object.keys(req.body).includes("github")){
    //https://api.github.com/repos/[USER]/[REPO]/git/trees/[BRANCH]?recursive=1
    if (req.body.github.githubConnected == false)
    {
      updateSetting(req.params.id,req.body,res,next)
    }
    else
    {
      console.log(req.body.github)
      const octokit = new Octokit({ auth: `${req.body.github.githubToken}` });
      try {
        const response = await octokit.request(`GET /repos/{owner}/{repo}/git/trees/{branch}?recursive=1`, {
          owner: req.body.github.githubURL.split("/")[0],
          repo: req.body.github.githubURL.split("/")[1],
          branch: req.body.github.githubBranch
        })
        updateSetting(req.params.id,req.body,res,next)
        res.json("Github Connection Succesful")
        Settings.find({}, (error, data) => {
          const prefixList = data[0].langs.map(lang=>lang.type)
          updateGithubTree(response.data.tree,octokit,prefixList)
        });
      } catch (error) {
        console.log(error)
        res.json("Error " + error.status + ": " + error.response.data.message)
      }
    }
  }
  else
  {
    updateSetting(req.params.id,req.body,res,next)
  }

})

function updateSetting(id,body,res,next){
  Settings.findByIdAndUpdate(id, {
    $set: body
  }, (error, data) => {
    if (error) {
      return next(error);
    } else {
      console.log('Data updated successfully')
    }
  })
}

// Delete settings
settingsRoute.route('/delete/:id').delete((req, res, next) => {
  Settings.findByIdAndRemove(req.params.id, (error, data) => {
    console.log("Removing: " + req.params.id)
    if (error) {
      return next(error);
    } else {
      res.status(200).json({
        msg: data
      })
    }
  })
})

module.exports = {settingsRoute,updateGithubTree};