#!/usr/bin/env node
let validate = require('./src/_validate')
let series = require('run-series')
let _inventory = require('@architect/inventory')
let { updater } = require('@architect/utils')

// possible commands
let add = require('./src/_add')
let all = require('./src/_all')
let print = require('./src/_print')
let remove = require('./src/_remove')
let write = require('./src/_write')

module.exports = function env (opts, callback) {
  let promise
  if (!callback) {
    promise = new Promise(function ugh (res, rej) {
      callback = function errback (err, result) {
        if (err) rej(err)
        else res(result)
      }
    })
  }

  // Validate for expected env and check for potential creds issues
  validate()

  _inventory({}, function (err, inventory) {
    if (err) callback(err)
    else {
      let update = updater('Env')
      let appname = inventory.inv.app
      let params = { appname, update }
      let envs = [ 'testing', 'staging', 'production' ]
      let prints = {
        testing: false,
        staging: false,
        production: false,
      }

      let is = {
        all:    opts.length === 0,
        add:    opts.length === 3 && envs.includes(opts[0]),
        remove: opts.length === 3 && opts[0] === 'remove' ||
                opts.length === 3 && opts[0] === '--remove' ||
                opts.length === 3 && opts[0] === '-r',
      }

      if (is.all) {
        // npx env ............................ all
        prints = {
          testing: true,
          staging: true,
          production: true,
        }
        printAndWriteAll({ ...params, prints }, callback)
      }
      else if (is.add) {
        // npx env testing FOOBAZ somevalue ... put
        series([
          function _add (callback) {
            add(params, opts, callback)
          },
          function _print (callback) {
            prints[opts[0]] = true
            printAndWriteAll({ ...params, prints }, callback)
          },
        ], callback)
      }
      else if (is.remove) {
        // npx env remove testing FOOBAZ ...... remove
        // remove/print all/verify all
        series([
          function _remove (callback) {
            remove(params, opts, callback)
          },
          function _print (callback) {
            prints[opts[1]] = true
            printAndWriteAll({ ...params, prints }, callback)
          },
        ], callback)
      }
      else {
        callback(Error('Invalid command'))
      }
    }
  })

  return promise
}

function printAndWriteAll (params, callback) {
  all(params, function (err, envVars) {
    print(err, { envVars, ...params })
    write({ envVars, ...params })
    callback()
  })
}

module.exports.add = add
module.exports.all = all
module.exports.print = print
module.exports.remove = remove
module.exports.write = write
