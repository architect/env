module.exports = function isReserved (key) {
  let reserved = [ 'NODE_ENV', 'ARC_APP_NAME' ]
  return reserved.includes(key)
}
