#!/usr/bin/env node
let minimist = require('minimist')
let _inventory = require('@architect/inventory')
let { banner, updater } = require('@architect/utils')
let { version } = require('../package.json')

let env = require('.')
let update = updater('Env')

async function main (opts = {}) {
  let { inventory } = opts
  if (!inventory) {
    inventory = await _inventory({})
  }

  let alias = {
    add:        [ 'a' ],
    env:        [ 'e' ],
    remove:     [ 'r' ],
    debug:      [ 'd' ],
    verbose:    [ 'v' ],
  }
  let boolean = [ 'add', 'debug', 'remove', 'verbose' ]
  let args = minimist(process.argv.slice(2), { alias, boolean })
  if (args._[0] === 'env') args._.splice(0, 1)

  let params = {}
  if (args.add) {
    params = {
      action: 'add',
      env:    args.env,
      name:   args._[0],
      value:  args._[1],
    }
  }
  else if (args.remove) {
    params = {
      action: 'remove',
      env:    args.env,
      name:   args._[0],
      value:  args._[1],
    }
  }
  else {
    params.action = 'print'
  }
  return env({ ...params, inventory, update })
}

module.exports = main

if (require.main === module) {
  (async function () {
    try {
      let inventory = await _inventory({})
      banner({ inventory, version: `Env ${version}` })
      await main({ inventory })
    }
    catch (err) {
      console.log(err)
    }
  })()
}
