# cup-readdir

efficient way to get an array of all file paths from directory

## Installing

```sh
npm i cup-readdir
```

## Performance

![Files](https://raw.githubusercontent.com/blubitz/cup-readdir/master/images/speedtest.png)

__cup-readdir__ uses asynchronous `promises` when handling subdirectory recursion. The enhancement in speed is clearly visible when tested against similar packages, using `console.time()` on the retrieval of 10,201 files (101 subdirectories, 101 files per directory). Although it has fewer features than other packages, its performance is the fastest overall.

## Usage

### getAllFilePaths(dir)

```js
const cupr = require('cup-readdir')

cupr.getAllFilePaths('path/to/dir').then(paths => {
  // do something with file paths
  console.log(paths)
})
```

This function returns a promise which will be resolved with an array of all file paths found recursively in the directory `dir`(`<string>`) *excluding*  directory names.

### sort(filepaths, property[, descendingOrder])

```js
const cupr = require('cup-readdir')

cupr.getAllFilePaths('path/to/dir').then(paths => {
  // sort by ascending file size
  return cupr.sort(paths, 'size')
})
.then(fileInfos => {
  for (const fileInfo of fileInfos) {
    // do something with FileInfo objects
  }
})
```

This function takes in an array of file paths and returns a list of `<FileInfo>` objects sorted by the given property. `property` (`<string>`) can be any [`fs.stats`](https://nodejs.org/api/fs.html#fs_class_fs_stats) property (not `bigint` version). Sorted array of `<FileInfo>` objects are in ascending order, but the optional `descendingOrder` (`<boolean>`) parameter can be set to `true` to return that in descending order.

### FileInfo Object

A `<FileInfo>` object has all properties of an [`fs.stats`](https://nodejs.org/api/fs.html#fs_class_fs_stats) object with an additional `url` property storing file path. Some of the properties are shown below.

```
FileInfo {
  url: "js/helper.js", // path to file
  birthtime: Mon, 10 Oct 2021 23:24:11 GMT, // <Date> object storing date of file creation
  size: 527, // size of file in bytes
  mode: 33188 // file type and mode
  // ...
}
```

## Example

```js
const cupr = require('cup-readdir')
const p = require('path')

// Get photos for blog carousel
async function getRecentPhotos(dir) {
  let paths = await cupr.getAllFilePaths(dir)
  let photos = paths.filter(path => p.extname(path) == '.png')

  // sort list of photos in descending order of creation time
  return await cupr.sort(photos, 'birthtimeMs', true)
}
```

## What does 'cup' stand for?

It's like cup noodles; quick and not fancy.

## Tests

Mocha is used for testing. Test script is located in `test/test.js`.

```sh
npm test
```

## License

MIT

## Copyright
Copyright 2021 blubitz
