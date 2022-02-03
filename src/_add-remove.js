let aws = require('aws-sdk')
let isReserved = require('./_is-reserved')

module.exports = function _addRemove (params, callback) {
  let { action, env, inventory, name, update, value } = params
  let { inv } = inventory
  let { app } = inv
  let region = inv.aws.region

  // only the following namespaces allowed
  let allowed = [
    'testing',
    'staging',
    'production'
  ]

  // IEEE 1003.1-2001 does not allow lowercase, so consider this a compromise for the Windows folks in the house
  let validName = /^[a-zA-Z0-9_]+$/.test(name) && (name === 'testing' ? true : !isReserved(name))

  if (!allowed.includes(env)) {
    callback(Error(`Invalid environment: must be one of: ${allowed.join(', ')}`))
  }
  else if (!validName) {
    callback(Error('Invalid name: can contain [a-zA-Z0-9_]'))
  }
  else if (action === 'add' && !value) {
    callback(Error('Invalid value: must specify environment variable value to add'))
  }
  else {
    let verb = action === 'add' ? 'Add' : 'Remov'
    let prep = action === 'add' ? 'to' : 'from'
    update.start(`${verb}ing ${name} ${prep} ${env} environment`)
    function done (err) {
      if (action === 'remove' && err?.code === 'ParameterNotFound') {
        update.done(`Env var ${name} not found in ${env} environment`)
        callback()
      }
      else if (err) {
        update.cancel()
        callback(err)
      }
      else {
        update.done(`${verb}ed ${name} ${prep} ${env} environment`)
        callback()
      }
    }
    let ssm = new aws.SSM({ region })
    if (action === 'add') {
      ssm.putParameter({
        Name: `/${app}/${env}/${name}`,
        Value: value,
        Type: 'SecureString',
        Overwrite: true
      }, done)
    }
    else {
      ssm.deleteParameter({
        Name: `/${app}/${env}/${name}`,
      }, done)
    }
  }
}
