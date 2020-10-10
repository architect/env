let test = require('tape')
let sinon = require('sinon')
let aws = require('aws-sdk-mock')
let add = require('../src/_add')
let series = require('run-series')

test('_add should callback with error if invalid namespace provided', t => {
  t.plan(1)
  add('fakeappname', [ 'apocalypse', 'foo', 'bar' ], function done (err) {
    if (err) t.ok(err, 'got an error when invalid namespace provided')
    else t.fail('no error returned when invalid namespace provided')
  })
})

test('_add should callback with error if invalid key provided', t => {
  t.plan(1)
  add('fakeappname', [ 'testing', 'foo', 'bar' ], function done (err) {
    if (err) t.ok(err, 'got an error when invalid key provided')
    else t.fail('no error returned when invalid key provided')
  })
})

test('_add should treat all provided values as valid', t => {
  let fake = sinon.fake.yields()
  aws.mock('SSM', 'putParameter', fake)
  let valids = [
    [ 'testing', 'FOO', 'http://foo.com/?bar=baz' ],
    [ 'testing', 'FOO', 'BAR' ],
    [ 'testing', 'FOO', `"foo-bar_baz"` ],
    [ 'testing', 'FOO', `"foo.bar"` ],
    [ 'testing', 'FOO', '[${foo}]' ],
    [ 'testing', 'FOO', '(%)^{}idk!' ]
  ]
  t.plan(valids.length)
  series(valids.map(v => {
    return callback => {
      add('fakeappname', v, function done (err) {
        if (err) t.fail(err, 'got an error when valid value provided')
        else {
          t.pass('no error returned when valid value provided')
          callback()
        }
      })
    }
  }))
  sinon.restore()
  aws.restore('SSM')
})

test('_add should callback with error if SSM errors', t => {
  t.plan(1)
  let fake = sinon.fake.yields({ boom: true })
  aws.mock('SSM', 'putParameter', fake)
  add('fakeappname', [ 'testing', 'FOO', 'BAR' ], function done (err) {
    if (err) t.ok(err, 'got an error when SSM explodes')
    else t.fail('no error returned when SSM explodes')
  })
  aws.restore('SSM')
})
