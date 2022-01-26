module.exports = function validate ({ update }) {
  try {
    if (process.env.ARC_AWS_CREDS === 'missing') {
      throw Error('missing or invalid AWS credentials or credentials file')
    }
  }
  catch (err) {
    update.error(`Failed to update environment: ${err}`)
    process.exit(1)
  }
}
