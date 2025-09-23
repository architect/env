let { updater, series } = require('@architect/utils')
let awsLite = require('@aws-lite/client')

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

  let prints = {
    testing: false,
    staging: false,
    production: false,
  }

  awsLite({
    profile: inventory.inv.aws.profile,
    region: inventory.inv.aws.region,
    plugins: [ import('@aws-lite/ssm') ],
  })
    .then(aws => {
      if (action === 'print') {
        prints = {
          testing: true,
          staging: true,
          production: true,
        }
        printAndWrite({ aws, inventory, prints, update }, callback)
      }
      else if (actions.includes(action)) {
        series([
          function (callback) {
            addRemove(params, aws, callback)
          },
          function (callback) {
            prints[params.env] = true
            printAndWrite({ aws, inventory, prints, update }, callback)
          },
        ], callback)
      }
      else {
        callback(Error(`Invalid action: must be one of: ${actions.join(', ')}`))
      }
    })
    .catch(callback)


  return promise
}

function printAndWrite (params, callback) {
  getEnv(params, function (err, envVars) {
    print(err, { envVars, ...params })
    write({ envVars, ...params }, callback)
  })
}
