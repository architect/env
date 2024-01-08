module.exports = function _all ({ aws, inventory, update }, callback) {
  let appname = inventory.inv.app

  update.start('Reading environment variables')
  aws.ssm.GetParametersByPath({
    Path: `/${appname}`,
    Recursive: true,
    MaxResults: 10,
    WithDecryption: true,
    paginate: true
  })
    .then(data => {
      let result = data.Parameters.map(function (param) {
        let bits = param.Name.split('/')
        return {
          app: appname,
          env: bits[2],
          name: bits[3],
          value: param.Value,
        }
      })
      let envs = [ 'testing', 'staging', 'production' ]
      let qty = result.filter(({ env }) => envs.includes(env)).length
      update.done(`Total environment variables found: ${qty}`)
      callback(null, result)
    })
    .catch(callback)


}
