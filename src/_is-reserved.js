module.exports = function isReserved (key) {
  let reserved = [ 'ARC_ENV', 'ARC_APP_NAME' ]
  return reserved.includes(key)
}
