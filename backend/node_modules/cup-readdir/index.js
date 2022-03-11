const fs = require('fs')
const path = require('path')

function cupreaddir() {

  this.getAllFilePaths = async function (dir) {
    let filePaths = []

    async function recur(dir) {
      try {
        let items = await fs.promises.readdir(dir, {withFileTypes: true})
        let pendingDirs = []

        for (item of items) {
          let url = path.join(dir, item.name)
          if (item.isDirectory()) {
            pendingDirs.push( recur(url) )
          } else if (item.isFile()) {
            filePaths.push(url)
          }
        }

        return Promise.all(pendingDirs)
      } catch (err) {
        console.log(err)
      }
    }

    await recur(dir)
    return filePaths
  }

  this.sort = async function (filepaths, property, descending=false) {
    let fileInfo = await Promise.all(filepaths.map(async (filepath) => {
      let stats = await fs.promises.stat(filepath)
      stats.url = filepath
      return stats
    }))

    return (descending) ?
    fileInfo.sort((a, b) => {return b[property] - a[property]}) :
    fileInfo.sort((a, b) => {return a[property] - b[property]})
  }
}
module.exports = new cupreaddir()
