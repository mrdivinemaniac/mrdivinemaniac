const fs = require('fs')
const path = require('path')

function fileHasSomeExtension (file, extensions) {
  return extensions.some(ext => file.endsWith('.' + ext))
}

function findFilesWithExtensions (path, extensions) {
  return fs.readdirSync(path)
    .filter(f => fileHasSomeExtension(f, extensions))
}

function findFilesWithExtensionsRecursively (targetPath, extensions) {
  const files = fs.readdirSync(targetPath)
  return files.reduce((allFiles, fileName) => {
    const filePath = path.join(targetPath, fileName)
    const stats = fs.statSync(filePath)
    if (stats.isDirectory()) {
      return [...allFiles, ...findFilesWithExtensionsRecursively(filePath, extensions)]
    } else if (fileHasSomeExtension(fileName, extensions)) {
      return [...allFiles, filePath]
    } else {
      return [...allFiles]
    }
  }, [])
}

function removeExtension (fileName) {
  return fileName.split('.')[0]
}

function copyFilesFromDirRecursively (srcDir, dstDir) {
  console.log(`\nCopying files from ${srcDir}`)
  const files = fs.readdirSync(srcDir)
  console.log(`Found ${files.length}`)
  files.forEach(fileName => {
    const srcPath = path.join(srcDir, fileName)
    const dstPath = path.join(dstDir, fileName)
    const stats = fs.statSync(srcPath)
    if (stats.isDirectory()) {
      mkDirIfNotExists(dstPath)
      copyFilesFromDirRecursively(srcPath, dstPath)
    } else {
      console.log(`Copying ${fileName}`)
      fs.copyFileSync(srcPath, dstPath, fs.constants.COPYFILE)
    }
  })
}

function stitchFilesWithExtensionsRecursively (targetPath, extensions, dstFileName) {
  const allFiles = findFilesWithExtensionsRecursively(targetPath, extensions)
  console.log('Found the following files with extensions:', extensions.join(','))
  console.log(allFiles.join('\n'))
  const newFileContents = allFiles.reduce((newFileContents, filePath) => {
    const fileContents = fs.readFileSync(filePath)
    return [newFileContents, fileContents].join('\n')
  }, '')
  fs.writeFileSync(dstFileName, newFileContents)
}

function mkDirIfNotExists (path) {
  if (!fs.existsSync(path)) fs.mkdirSync(path)
}

module.exports = {
  fileHasSomeExtension,
  removeExtension,
  copyFilesFromDirRecursively,
  findFilesWithExtensions,
  findFilesWithExtensionsRecursively,
  stitchFilesWithExtensionsRecursively,
  mkDirIfNotExists
}
