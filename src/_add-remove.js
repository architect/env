let isReserved = require('./_is-reserved')

module.exports = function _addRemove (params, aws, callback) {
  let { action, env, inventory, name, update, value } = params
  let { app } = inventory.inv

  // only the following namespaces allowed
  let allowed = [
    'testing',
    'staging',
    'production',
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
    if (action === 'add') {
      aws.ssm.PutParameter({
        Name: `/${app}/${env}/${name}`,
        Value: `${value}`,
        Type: 'SecureString',
        Overwrite: true,
      })
        .then(() => done())
        .catch(done)
    }
    else {
      aws.ssm.DeleteParameter({
        Name: `/${app}/${env}/${name}`,
      })
        .then(() => done())
        .catch(done)
    }
  }
}
