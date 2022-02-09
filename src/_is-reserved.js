module.exports = function isReserved (key) {
  let reserved = [
    'ARC_APP_NAME',
    'ARC_DISABLE_ENV_VARS',
    'ARC_ENV',
    'ARC_ROLE',
    'ARC_SANDBOX',
    'ARC_WSS_URL',
  ]
  return reserved.includes(key)
}
