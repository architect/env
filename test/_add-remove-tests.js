/* let test = require('tape')
let sinon = require('sinon')
let AWS = require('aws-sdk')
let aws = require('aws-sdk-mock')
aws.setSDKInstance(AWS)
let addRemove = require('../src/_add-remove')
let series = require('run-series')
let { updater } = require('@architect/utils')

let update = updater('Env')
let params = { inventory: { inv: {
  app: 'appname',
  aws: { region: 'us-west-2' },
} }, update }

test('Add should error on invalid environment', t => {
  t.plan(1)
  let item = {
    action: 'add',
    env: 'idk',
    name: 'foo',
    value: 'bar',
  }
  addRemove({ ...params, ...item }, function done (err) {
    if (err) t.match(err.message, /Invalid environment/, 'Errored on invalid environment')
    else t.fail('Expected invalid environment error')
  })
})

test('Remove should error on invalid environment', t => {
  t.plan(1)
  let item = {
    action: 'remove',
    env: 'idk',
    name: 'foo',
    value: 'bar',
  }
  addRemove({ ...params, ...item }, function done (err) {
    if (err) t.match(err.message, /Invalid environment/, 'Errored on invalid environment')
    else t.fail('Expected invalid environment error')
  })
})

test('Adding should callback with error on invalid name', t => {
  t.plan(1)
  let item = {
    action: 'add',
    env: 'testing',
    name: '$idk',
    value: 'bar',
  }
  addRemove({ ...params, ...item }, function done (err) {
    if (err) t.match(err.message, /Invalid name/, 'Errored on invalid name')
    else t.fail('Expected invalid name error')
  })
})

test('Remove should callback with error on invalid name', t => {
  t.plan(1)
  let item = {
    action: 'remove',
    env: 'testing',
    name: '$idk',
    value: 'bar',
  }
  addRemove({ ...params, ...item }, function done (err) {
    if (err) t.match(err.message, /Invalid name/, 'Errored on invalid name')
    else t.fail('Expected invalid name error')
  })
})

test('Add should error on missing value', t => {
  t.plan(1)
  let item = {
    action: 'add',
    env: 'testing',
    name: 'foo',
  }
  addRemove({ ...params, ...item }, function done (err) {
    if (err) t.match(err.message, /Invalid value/, 'Errored on invalid value')
    else t.fail('Expected invalid value error')
  })
})

test('Add should treat all provided values as valid', t => {
  let fake = sinon.fake.yields()
  aws.mock('SSM', 'putParameter', fake)
  let valids = [
    'http://foo.com/?bar=baz',
    'BAR',
    `"foo-bar_baz"`,
    `"foo.bar"`,
    '[${foo}]',
    '(%)^{}idk!',
  ]
  t.plan(valids.length)
  series(valids.map(value => {
    return callback => {
      let item = {
        action: 'add',
        env: 'testing',
        name: 'foo',
        value
      }
      addRemove({ ...params, ...item }, function done (err) {
        if (err) t.fail(err, 'Errored on valid values')
        else {
          t.pass('No error returned')
          callback()
        }
      })
    }
  }))
  sinon.restore()
  aws.restore('SSM')
})

test('Adding should callback with error if SSM errors', t => {
  t.plan(1)
  let fake = sinon.fake.yields({ boom: true })
  aws.mock('SSM', 'putParameter', fake)
  let item = {
    action: 'add',
    env: 'testing',
    name: 'foo',
    value: 'bar',
  }
  addRemove({ ...params, ...item }, function done (err) {
    if (err) t.ok(err, 'Errored on SSM issue')
    else t.fail('Expected SSM error')
  })
  aws.restore('SSM')
})

test('Remove should callback with error if SSM errors', t => {
  t.plan(1)
  let fake = sinon.fake.yields({ boom: true })
  aws.mock('SSM', 'deleteParameter', fake)
  let item = {
    action: 'remove',
    env: 'testing',
    name: 'foo',
  }
  addRemove({ ...params, ...item }, function done (err) {
    if (err) t.ok(err, 'Errored on SSM issue')
    else t.fail('Expected SSM error')
  })
  aws.restore('SSM')
})

test('Remove should not callback with error if parameter is not found', t => {
  t.plan(1)
  let fake = sinon.fake.yields({ code: 'ParameterNotFound' })
  aws.mock('SSM', 'deleteParameter', fake)
  let item = {
    action: 'remove',
    env: 'testing',
    name: 'foo',
  }
  addRemove({ ...params, ...item }, function done (err) {
    if (err) t.fail('Should not have errored')
    else t.pass(`No error returned`)
  })
  aws.restore('SSM')
})
 */
