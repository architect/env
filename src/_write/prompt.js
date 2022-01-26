let yesno = require('yesno')

module.exports = function prompt (update, callback) {
  let defaultValue = true
  function invalid () {
    let yes = `Yes: (yes, y)`
    let no = `No: (no, n)`
    update.status('Please enter either:', yes, no)
  }
  // yesno doesn't specifically support testing, so bypass it for tests
  if (process.env.ARC_TESTING) callback(null, true)
  else yesno({ question: '', defaultValue, invalid })
    .then(val => callback(null, val))
    .catch(callback)
}
