let series = require('run-series')
let readArc = require('@architect/utils/read-arc')

// possible commands
let _all = require('./src/_all')
let _add = require('./src/_add')
let _remove = require('./src/_remove')
let _printer = require('./src/_printer')

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

  let {arc} = readArc()
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
    _all(appname, function(err, result) {
      _printer(err, result)
      callback()
    })
  }
  else if (is.add) {
    // npx env testing FOOBAZ somevalue ... put
    series([
      function removes(callback) {
        _add(appname, opts, callback)
      },
      function prints(callback) {
        _all(appname, function(err, result) {
          _printer(err, result)
          callback()
        })
      },
    ], callback)
  }
  else if (is.remove) {
    // npx env remove testing FOOBAZ ...... remove
    // remove/print all/verify all
    series([
      function removes(callback) {
        _remove(appname, opts, callback)
      },
      function prints(callback) {
        _all(appname, function(err, result) {
          _printer(err, result)
          callback()
        })
      },
    ], callback)
  }
  else {
    callback(Error('invalid command'))
  }

  return promise
}
