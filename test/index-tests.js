const { test } = require('node:test')
const assert = require('node:assert')

let addRan = false
let removeRan = false
let mockAddRemove = (params, aws, callback) => {
  let { action } = params
  if (action === 'add') addRan = true
  if (action === 'remove') removeRan = true
  callback()
}

let getEnvRan = false
let mockGetEnv = (params, callback) => {
  getEnvRan = true
  callback(null, [])
}

let printRan = false
let mockPrint = () => ( printRan = true )

let writeRan = false
let mockWrite = (params, callback) => {
  writeRan = true
  callback()
}

function reset () {
  addRan = false
  getEnvRan = false
  printRan = false
  removeRan = false
  writeRan = false
}

// Mock the internal modules by replacing them in the require cache
// Load the modules first to populate the cache
require('../src/_add-remove')
require('../src/_get-env')
require('../src/_print')
require('../src/_write')

// Replace the module exports with mocks
require.cache[require.resolve('../src/_add-remove')].exports = mockAddRemove
require.cache[require.resolve('../src/_get-env')].exports = mockGetEnv
require.cache[require.resolve('../src/_print')].exports = mockPrint
require.cache[require.resolve('../src/_write')].exports = mockWrite

let env = require('../src/index')

let inventory = { inv: {
  app: 'fakename',
  aws: { region: 'us-west-2' },
} }

test('Set up env', () => {
  process.env.AWS_ACCESS_KEY_ID = 'dummy'
  process.env.AWS_SECRET_ACCESS_KEY = 'dummy'
  assert.ok(true, 'Set up dummy creds')
})

test('Env errors if provided an unrecognized action', () => {
  env({ action: 'idk', inventory }, function done (err) {
    if (err) assert.ok(err, 'got an error when env called with incorrect options')
    else assert.fail('no error returned when env called with incorrect options')
  })
})

test('Env prints and writes preferences on print', () => {
  env({ action: 'print', inventory }, function done (err) {
    if (err) {
      assert.fail('unexpected error when calling env with no parameters')
      console.log(err)
    }
    else {
      assert.ok(getEnvRan, '`getEnv` invoked once')
      assert.ok(printRan, '`print` invoked once')
      assert.ok(writeRan, '`write` invoked once')
    }
    reset()
  })
})

test('Env invokes add, prints, and writes on a valid add request', () => {
  let params = { action: 'add', env: 'production', name: 'foo', value: 'bar', inventory }
  env(params, function done (err) {
    if (err) {
      assert.fail('unexpected error when calling env with add parameters')
      console.log(err)
    }
    else {
      assert.ok(getEnvRan, '`getEnv` invoked once')
      assert.ok(printRan, '`print` invoked once')
      assert.ok(writeRan, '`write` invoked once')
      assert.ok(addRan, '`add` invoked once')
    }
    reset()
  })
})

test('Env invokes remove, prints, and writes on a valid remove request', () => {
  let params = { action: 'remove', env: 'production', name: 'foo', value: 'bar', inventory }
  env(params, function done (err) {
    if (err) {
      assert.fail('unexpected error when calling env with remove parameters')
      console.log(err)
    }
    else {
      assert.ok(getEnvRan, '`getEnv` invoked once')
      assert.ok(printRan, '`print` invoked once')
      assert.ok(writeRan, '`write` invoked once')
      assert.ok(removeRan, '`remove` invoked once')
    }
    reset()
  })
})

test('Tear down env', () => {
  delete process.env.AWS_ACCESS_KEY_ID
  delete process.env.AWS_SECRET_ACCESS_KEY
  assert.ok(true, 'Destroyed dummy creds')
})
