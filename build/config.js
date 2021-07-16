const path = require('path')

const PROJECT_ROOT_DIR = path.join(__dirname,  '../')
const SRC_DIR = path.join(PROJECT_ROOT_DIR, 'src')

const DIRS = {
  PROJECT_ROOT: PROJECT_ROOT_DIR,
  SRC: SRC_DIR,
  HELPERS_SRC: path.join(SRC_DIR, 'helpers'),
  BUILD_DST: path.join(PROJECT_ROOT_DIR, 'docs'),
  PAGES_SRC: path.join(SRC_DIR, 'pages'),
  STATIC_SRC: path.join(SRC_DIR, 'static'),
  STATIC_DST: path.join(SRC_DIR, '../docs'),
  COMMON_PARTIALS: path.join(SRC_DIR, 'partials')
}
const FILE_AND_FOLDER_NAMES = {
  PAGE_TEMPLATE: 'index.hbs',
  PAGE_DATA: 'index.js',
  PAGE_PARTIALS: 'partials',
  PARTIALS_TEMPLATE: 'index.hbs',
  STITCHED_CSS: 'index.css'
}

module.exports = {
  DIRS,
  FILE_AND_FOLDER_NAMES
}