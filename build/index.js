const {
  DIRS,
  FILE_AND_FOLDER_NAMES
} = require('./config')
const path = require('path')
const { loadPartials } = require('./partials')
const { copyFilesFromDirRecursively, stitchFilesWithExtensionsRecursively, mkDirIfNotExists } = require('./files')
const { buildPages } = require('./pages')
require(DIRS.HELPERS_SRC)

printConfiguration()
console.log('Loading Global Partials')

mkDirIfNotExists(DIRS.BUILD_DST)

loadPartials(DIRS.COMMON_PARTIALS, FILE_AND_FOLDER_NAMES.PARTIALS_TEMPLATE)
console.log('\nBuilding Pages')
buildPages(
  DIRS.PAGES_SRC,
  DIRS.BUILD_DST,
  FILE_AND_FOLDER_NAMES.PAGE_TEMPLATE,
  FILE_AND_FOLDER_NAMES.PAGE_DATA,
  FILE_AND_FOLDER_NAMES.PAGE_PARTIALS,
  FILE_AND_FOLDER_NAMES.PARTIALS_TEMPLATE
)
console.log('\nCombining CSS Files')
stitchFilesWithExtensionsRecursively(
  DIRS.SRC,
  ['css'],
  path.join(DIRS.BUILD_DST, FILE_AND_FOLDER_NAMES.STITCHED_CSS)
)
console.log('\nCopying static files')
copyFilesFromDirRecursively(DIRS.STATIC_SRC, DIRS.STATIC_DST)

function printConfiguration () {
  console.log('\nConfiguration:')
  console.dir(DIRS)
  console.dir(FILE_AND_FOLDER_NAMES)
}
