const path = require('path')
const fs = require('fs')
const { loadPartials } = require('./partials')
const handlebars = require('handlebars')

function buildPages (srcDir, dstDir, pageTemplateName, pageDataSrcName, pagePartialDirName, partialTemplateName) {
  console.log(`\nBuilding pages`)
  const pageFolders = fs.readdirSync(srcDir)
  console.log(`Found ${pageFolders.length}`)
  pageFolders.forEach(pageName => {
    const srcHbsPath = path.join(srcDir, pageName, pageTemplateName)
    const srcDataPath = path.join(srcDir, pageName, pageDataSrcName)
    const pagePartialsFolderPath = path.join(srcDir, pageName, pagePartialDirName)
    const builtHbsFileName = pageName + '.html'
    const builtHbsFilePath = path.join(dstDir, builtHbsFileName)
    console.log(`Building ${pageName}`)
    if (fs.existsSync(pagePartialsFolderPath)) {
      console.log(`Loading partials`)
      loadPartials(pagePartialsFolderPath, partialTemplateName)
    }
    const pageData = fs.existsSync(srcDataPath)
      ? require(srcDataPath)
      : {}
    buildPage(srcHbsPath, builtHbsFilePath, pageData)
  })
}

function buildPage (srcPath, dstPath, data = {}) {
  const template = fs.readFileSync(srcPath, 'utf8')
  const compiled = handlebars.compile(template)
  const outHtml = compiled(data)
  fs.writeFileSync(dstPath, outHtml)
}

module.exports = { buildPages }
