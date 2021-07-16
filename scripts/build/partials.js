const handlebars = require('handlebars')
const path = require('path')
const fs = require('fs')
const { removeExtension, fileHasSomeExtension } = require('./files')

function loadPartials (targetPath, templateName) {
  const filesAndDirs = fs.readdirSync(targetPath)
  console.log(`Found ${filesAndDirs.length}`)
  filesAndDirs.forEach(fileName => {
    const fileOrDirPath = path.join(targetPath, fileName)
    const stats = fs.statSync(fileOrDirPath)
    // If it is a directory, look for hbs file inside it
    const filePath = stats.isDirectory()
      ? path.join(targetPath, fileName, templateName)
      : path.join(targetPath, fileName)
    if (!fileHasSomeExtension(filePath, ['hbs'])) return
    const content = fs.readFileSync(filePath, 'utf-8')
    console.log(`Loading ${fileName}`)
    const name = removeExtension(fileName)
    handlebars.registerPartial(name, content)
  })
}

module.exports = { loadPartials }
