const { DIRS, FILE_AND_FOLDER_NAMES } = require('../../config')
const path = require('path')
const sharp = require('sharp')
const request = require('request')
const crypto = require('crypto')
const fs = require('fs')

const POSTS_FILE_PATH = path.join(DIRS.SRC, 'data', 'posts.json')
const postsData = require(POSTS_FILE_PATH)

const GENERATED_THUMBNAILS_DIR_NAME = 'resized'
const GENERATED_THUMBNAILS_DST = path.join(DIRS.STATIC_IMAGES_SRC, GENERATED_THUMBNAILS_DIR_NAME)

ensureDirectoryExists(DIRS.STATIC_IMAGES_SRC)
ensureDirectoryExists(GENERATED_THUMBNAILS_DST)
generateForPosts(postsData)

function ensureDirectoryExists (dir) {
  if (!checkFileExists(dir)) {
    fs.mkdirSync(dir)
  }
}

async function generateForPosts (posts) {
  const modifiedPosts = [ ...posts ]
  for (let i = 0; i < posts.length; ++i) {
    const post = posts[i]
    const thumbnailPath = await generateForPostIfRequired(posts[i]) || post.thumbnail
    modifiedPosts[i] = { ...post, thumbnail: thumbnailPath }
    console.log('Writing to disk...')
    writeJsonToPath(modifiedPosts, POSTS_FILE_PATH)
  }
  return modifiedPosts
}

async function generateForPostIfRequired (post) {
  console.log(`Generating thumbnail for post titled: ${post.title}`)
  if (!post.image) {
    console.log(` > No image attached to post. Skipping...`)
    return
  }
  if (post.thumbnail) {
    const thumbnailPath = path.join(DIRS.STATIC_SRC, post.thumbnail)
    if (checkFileExists(thumbnailPath)) {
      console.log(` > Thumbnail already exists. Skipping...`)
      return
    } else {
      console.log(` > Thumbnail is specified but does not exist. Generating a new one...`)
    }
  }
  const dstName = `${generateRandomId()}.jpg`
  const dstPath = path.join(GENERATED_THUMBNAILS_DST, dstName)
  try {
    await generateResizedImage(post.image, dstPath)
  } catch (e) {
    console.log(` > Error! Skipping...`)
    return
  }
  console.log(` > Thumbnail generated`)
  return path.join(FILE_AND_FOLDER_NAMES.STATIC_IMAGES, GENERATED_THUMBNAILS_DIR_NAME, dstName)
}

async function generateResizedImage (src, dst) {
  const imageBuffer = await requestImageAsBuffer(src)
  return sharp(imageBuffer)
    .resize(300)
    .toFile(dst)
}

function requestImageAsBuffer (src) {
  return new Promise((resolve, reject) => {
    request.get(src, { encoding: null }, (err, res, body) => {
      if (err) reject(err)
      resolve(body)
    })
  })
}

function generateRandomId () {
  return crypto.randomBytes(8).toString('hex')
}

function checkFileExists (filePath) {
  try {
    return fs.existsSync(filePath)
  } catch (e) {
    return false
  }
}

function writeJsonToPath (jsonData, dst) {
  const jsonAsString = JSON.stringify(jsonData, null, 2)
  fs.writeFileSync(dst, jsonAsString)
}
