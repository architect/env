let aws = require('aws-sdk')
let isReserved = require('./_is-reserved')

module.exports = function _add ({ appname, update }, params, callback) {

  // only the following namespaces allowed
  let allowed = [
    'testing',
    'staging',
    'production'
  ]

  // the params we expect
  let ns = params[0]
  let key = params[1]
  let val = params[2]

  // the state we expect them in
  let valid = {
    ns: allowed.includes(ns),
    key: /[A-Z|_]+/.test(key) && (ns === 'testing' ? true : !isReserved(key))
  }

  // blow up if something bad happens otherwise write the param
  if (!valid.ns) {
    callback(Error('Invalid argument, environment can only be one of: testing, staging, or production'))
  }
  else if (!valid.key) {
    callback(Error('Invalid argument, key must be all caps (and can contain underscores)'))
  }
  else {
    update.start(`Adding ${key} to ${ns} environment`)
    let ssm = new aws.SSM({ region: process.env.AWS_REGION })
    ssm.putParameter({
      Name: `/${appname}/${ns}/${key}`,
      Value: val,
      Type: 'SecureString',
      Overwrite: true
    },
    function done (err) {
      if (err) {
        update.cancel()
        callback(err)
      }
      else {
        update.done(`Added ${key} to ${ns} environment`)
        callback()
      }
    })
  }
}
