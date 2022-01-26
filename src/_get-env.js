let aws = require('aws-sdk')

module.exports = function _all ({ inventory, update }, callback) {
  let appname = inventory.inv.app
  let region = inventory.inv.aws.region

  let result = []
  let ssm = new aws.SSM({ region })

  function getSome (appname, NextToken, callback) {
    // base query to ssm
    let query = {
      Path: `/${appname}`,
      Recursive: true,
      MaxResults: 10,
      WithDecryption: true
    }
    // check if we're paginating
    if (NextToken) {
      query.NextToken = NextToken
    }
    // performs the query
    ssm.getParametersByPath(query, function _query (err, data) {
      if (err) callback(err)
      else {
        // tidy up the response
        result = result.concat(data.Parameters.map(function (param) {
          let bits = param.Name.split('/')
          return {
            app: appname,
            env: bits[2],
            name: bits[3],
            value: param.Value,
          }
        }))
        // check for more data and, if so, recurse
        if (data.NextToken) {
          getSome(appname, data.NextToken, callback)
        }
        else {
          // otherwise callback
          callback(null, result)
        }
      }
    })
  }

  update.start('Reading environment variables')
  getSome(appname, false, function done (err, result) {
    if (err) callback(err)
    else {
      let envs = [ 'testing', 'staging', 'production' ]
      let qty = result.filter(({ env }) => envs.includes(env)).length
      update.done(`Total environment variables found: ${qty}`)
      callback(null, result)
    }
  })
}
