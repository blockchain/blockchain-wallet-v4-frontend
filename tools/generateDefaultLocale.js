console.log('Hello world')

var fs = require('fs')
var path = require('path')
var glob = require('glob')
var R = require('ramda')

const rootPath = path.resolve(`${__dirname}/../i18n/messages`)
const outputPath = path.resolve(`${__dirname}/../i18n/aggregate`)
const outputFilename = 'en.json'

glob(rootPath + '/**/*.json', null, function (error, files) {
  if (error) {
    console.log('Error :' + error)
  } else {
    const f = o => ({[o.id]: o.defaultMessage})
    const r = R.map(f, R.flatten(R.map(require, files)))
    fs.writeFile(outputPath + '/' + outputFilename, JSON.stringify(r, null, 2))
  }
})
