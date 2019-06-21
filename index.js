let series = require('run-series')
let utils = require('@architect/utils')

module.exports = function env(opts, callback) {
  let promise
  if (!callback) {
    promise = new Promise(function ugh(res, rej) {
      callback = function errback(err, result) {
        if (err) rej(err)
        else res(result)
      }
    })
  }

  let {arc} = utils.readArc()
  let appname = arc.app[0]
  let envs = ['testing', 'staging', 'production']

  let is = {
    all:    opts.length === 0,
    add:    opts.length === 3 && envs.includes(opts[0]),
    remove: opts.length === 3 && opts[0] === 'remove' ||
            opts.length === 3 && opts[0] === '--remove' ||
            opts.length === 3 && opts[0] === '-r',
  }

  if (is.all) {
    // npx env ............................ all
    printAll(appname, callback)
  }
  else if (is.add) {
    // npx env testing FOOBAZ somevalue ... put
    series([
      function adds(callback) {
        module.exports.add(appname, opts, callback)
      },
      function prints(callback) {
        printAll(appname, callback)
      },
    ], callback)
  }
  else if (is.remove) {
    // npx env remove testing FOOBAZ ...... remove
    // remove/print all/verify all
    series([
      function removes(callback) {
        module.exports.remove(appname, opts, callback)
      },
      function prints(callback) {
        printAll(appname, callback)
      },
    ], callback)
  }
  else {
    callback(Error('invalid command'))
  }

  return promise
}

// possible commands
module.exports.all = require('./src/_all')
module.exports.add = require('./src/_add')
module.exports.remove = require('./src/_remove')
module.exports.printer = require('./src/_printer')

function printAll(appname, callback) {
  module.exports.all(appname, function(err, result) {
    module.exports.printer(err, result)
    callback()
  })
}
