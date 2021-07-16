const handlebars = require('handlebars')

// Source: https://stackoverflow.com/questions/34252817/handlebarsjs-check-if-a-string-is-equal-to-a-value
handlebars.registerHelper('equalsCaseInsensitive', function(arg1, arg2, options) {
  return arg1.toLowerCase() === arg2.toLowerCase()
})
