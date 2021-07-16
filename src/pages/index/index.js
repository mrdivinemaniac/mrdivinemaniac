const meta = require('../../data/meta.json')
const socials = require('../../data/socials.json')
const posts = require('../../data/posts.json')

const allCategories = posts.reduce(
  (allTags, { tags }) => ([ ...allTags, ...tags ]),
  []
).sort()

const tags = new Set(allCategories).values()

module.exports = {
  meta,
  socials,
  tags,
  posts
}
