#!/usr/bin/env node
let validate = require('./_validate')
let series = require('run-series')
let { updater } = require('@architect/utils')

let addRemove = require('./_add-remove')
let getEnv = require('./_get-env')
let print = require('./_print')
let write = require('./_write')
let actions = [ 'add', 'print', 'remove' ]

module.exports = function env (params, callback) {
  let { action, inventory, update } = params
  if (!update) params.update = update = updater('Env')

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
  validate({ action, update })

  let prints = {
    testing: false,
    staging: false,
    production: false,
  }

  if (action === 'print') {
    prints = {
      testing: true,
      staging: true,
      production: true,
    }
    printAndWrite({ inventory, prints, update }, callback)
  }
  else if (actions.includes(action)) {
    series([
      function (callback) {
        addRemove(params, callback)
      },
      function (callback) {
        prints[params.env] = true
        printAndWrite({ inventory, prints, update }, callback)
      },
    ], callback)
  }
  else {
    callback(Error(`Invalid action: must be one of: ${actions.join(', ')}`))
  }

  return promise
}

function printAndWrite (params, callback) {
  getEnv(params, function (err, envVars) {
    print(err, { envVars, ...params })
    write({ envVars, ...params }, callback)
  })
}
