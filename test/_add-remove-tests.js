/* const { test, mock } = require('node:test')
const assert = require('node:assert')
let AWS = require('aws-sdk')
let aws = require('aws-sdk-mock')
aws.setSDKInstance(AWS)
let addRemove = require('../src/_add-remove')
let { updater, series } = require('@architect/utils')

let update = updater('Env')
let params = { inventory: { inv: {
  app: 'appname',
  aws: { region: 'us-west-2' },
} }, update }

test('Add should error on invalid environment', () => {
  let item = {
    action: 'add',
    env: 'idk',
    name: 'foo',
    value: 'bar',
  }
  addRemove({ ...params, ...item }, function done (err) {
    if (err) assert.match(err.message, /Invalid environment/, 'Errored on invalid environment')
    else assert.fail('Expected invalid environment error')
  })
})

test('Remove should error on invalid environment', () => {
  let item = {
    action: 'remove',
    env: 'idk',
    name: 'foo',
    value: 'bar',
  }
  addRemove({ ...params, ...item }, function done (err) {
    if (err) assert.match(err.message, /Invalid environment/, 'Errored on invalid environment')
    else assert.fail('Expected invalid environment error')
  })
})

test('Adding should callback with error on invalid name', () => {
  let item = {
    action: 'add',
    env: 'testing',
    name: '$idk',
    value: 'bar',
  }
  addRemove({ ...params, ...item }, function done (err) {
    if (err) assert.match(err.message, /Invalid name/, 'Errored on invalid name')
    else assert.fail('Expected invalid name error')
  })
})

test('Remove should callback with error on invalid name', () => {
  let item = {
    action: 'remove',
    env: 'testing',
    name: '$idk',
    value: 'bar',
  }
  addRemove({ ...params, ...item }, function done (err) {
    if (err) assert.match(err.message, /Invalid name/, 'Errored on invalid name')
    else assert.fail('Expected invalid name error')
  })
})

test('Add should error on missing value', () => {
  let item = {
    action: 'add',
    env: 'testing',
    name: 'foo',
  }
  addRemove({ ...params, ...item }, function done (err) {
    if (err) assert.match(err.message, /Invalid value/, 'Errored on invalid value')
    else assert.fail('Expected invalid value error')
  })
})

test('Add should treat all provided values as valid', () => {
  let fake = mock.fn((params, callback) => callback())
  aws.mock('SSM', 'putParameter', fake)
  let valids = [
    'http://foo.com/?bar=baz',
    'BAR',
    `"foo-bar_baz"`,
    `"foo.bar"`,
    '[${foo}]',
    '(%)^{}idk!',
  ]
  series(valids.map(value => {
    return callback => {
      let item = {
        action: 'add',
        env: 'testing',
        name: 'foo',
        value
      }
      addRemove({ ...params, ...item }, function done (err) {
        if (err) assert.fail(err, 'Errored on valid values')
        else {
          assert.ok(true, 'No error returned')
          callback()
        }
      })
    }
  }))
  mock.restoreAll()
  aws.restore('SSM')
})

test('Adding should callback with error if SSM errors', () => {
  let fake = mock.fn((params, callback) => callback({ boom: true }))
  aws.mock('SSM', 'putParameter', fake)
  let item = {
    action: 'add',
    env: 'testing',
    name: 'foo',
    value: 'bar',
  }
  addRemove({ ...params, ...item }, function done (err) {
    if (err) assert.ok(err, 'Errored on SSM issue')
    else assert.fail('Expected SSM error')
  })
  aws.restore('SSM')
})

test('Remove should callback with error if SSM errors', () => {
  let fake = mock.fn((params, callback) => callback({ boom: true }))
  aws.mock('SSM', 'deleteParameter', fake)
  let item = {
    action: 'remove',
    env: 'testing',
    name: 'foo',
  }
  addRemove({ ...params, ...item }, function done (err) {
    if (err) assert.ok(err, 'Errored on SSM issue')
    else assert.fail('Expected SSM error')
  })
  aws.restore('SSM')
})

test('Remove should not callback with error if parameter is not found', () => {
  let fake = mock.fn((params, callback) => callback({ code: 'ParameterNotFound' }))
  aws.mock('SSM', 'deleteParameter', fake)
  let item = {
    action: 'remove',
    env: 'testing',
    name: 'foo',
  }
  addRemove({ ...params, ...item }, function done (err) {
    if (err) assert.fail('Should not have errored')
    else assert.ok(true, 'No error returned')
  })
  aws.restore('SSM')
})
 */
