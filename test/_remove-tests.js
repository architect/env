let test = require('tape')
let sinon = require('sinon')
let aws = require('aws-sdk-mock')
let remove = require('../src/_remove')
let { updater } = require('@architect/utils')
let update = updater('Env')
let params = { appname: 'fakeappname', update }

test('_remove should callback with error if invalid namespace provided', t => {
  t.plan(1)
  remove(params, [ 'remove', 'foo', 'bar' ], function done (err) {
    if (err) t.ok(err, 'got an error when invalid namespace provided')
    else t.fail('no error returned when invalid namespace provided')
  })
})

test('_remove should callback with error if invalid key provided', t => {
  t.plan(1)
  remove(params, [ 'remove', 'testing', 'bar' ], function done (err) {
    if (err) t.ok(err, 'got an error when invalid key provided')
    else t.fail('no error returned when invalid key provided')
  })
})

test('_remove should callback with error if SSM errors', t => {
  t.plan(1)
  let fake = sinon.fake.yields({ boom: true })
  aws.mock('SSM', 'deleteParameter', fake)
  remove(params, [ 'remove', 'testing', 'FOO' ], function done (err) {
    if (err) t.ok(err, 'got an error when SSM explodes')
    else t.fail('no error returned when SSM explodes')
  })
  aws.restore('SSM')
})

test('_remove should not callback with error if parameter is not found', t => {
  t.plan(1)
  let fake = sinon.fake.yields({ code: 'ParameterNotFound' })
  aws.mock('SSM', 'deleteParameter', fake)
  remove(params, [ 'remove', 'testing', 'FOO' ], function done (err) {
    if (err) t.fail('error should not have been returned')
    else t.pass(`it's all good`)
  })
  aws.restore('SSM')
})
