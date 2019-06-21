let test = require('tape')
let sinon = require('sinon')
let aws = require('aws-sdk-mock')
let add = require('../src/_add')

test('_add should callback with error if invalid namespace provided', t=> {
  t.plan(1)
  add('fakeappname', ['apocalypse', 'foo', 'bar'], function done(err) {
    if (err) t.ok(err, 'got an error when invalid namespace provided')
    else t.fail('no error returned when invalid namespace provided')
  })
});

test('_add should callback with error if invalid key provided', t=> {
  t.plan(1)
  add('fakeappname', ['testing', 'foo', 'bar'], function done(err) {
    if (err) t.ok(err, 'got an error when invalid key provided')
    else t.fail('no error returned when invalid key provided')
  })
});

test('_add should callback with error if invalid value provided', t=> {
  t.plan(1)
  add('fakeappname', ['testing', 'FOO', '@$$'], function done(err) {
    if (err) t.ok(err, 'got an error when invalid value provided')
    else t.fail('no error returned when invalid value provided')
  })
});

test('_add should callback with error if SSM errors', t=> {
  t.plan(1)
  let fake = sinon.fake.yields({boom:true})
  aws.mock('SSM', 'putParameter', fake)
  add('fakeappname', ['testing', 'FOO', 'BAR'], function done(err) {
    if (err) t.ok(err, 'got an error when SSM explodes')
    else t.fail('no error returned when SSM explodes')
  })
});
