let test = require('tape')
let sinon = require('sinon')
let aws = require('aws-sdk-mock')
let all = require('../src/_all')

test('_all should callback with error if SSM has error', t => {
  t.plan(1)
  let fake = sinon.fake.yields({ boom: true })
  aws.mock('SSM', 'getParametersByPath', fake)
  all('fakeappname', function done (err) {
    if (err) t.ok(err, 'got an error when SSM explodes')
    else t.fail('no error returned when SSM explodes')
    aws.restore('SSM')
  })
})

test('_all should return massaged data from SSM', t => {
  t.plan(1)
  let fake = sinon.fake.yields(null, {
    Parameters: [ { Name: 'ssm/fakeappname/testing/key', Value: 'value' } ]
  })
  aws.mock('SSM', 'getParametersByPath', fake)
  all('fakeappname', function done (err, results) {
    if (err) t.error(err, 'unexpected error callback when ssm returns proper data')
    else t.deepEqual(results, [ { app: 'fakeappname', env: 'testing', name: 'key', value: 'value' } ], 'got expected format for SSM env vars')
    aws.restore('SSM')
  })
})

test('_all should be able to handle paged data from SSM', t => {
  t.plan(2)
  let fake = sinon.fake(function (query, callback) {
    // Only on the first call, provide a next token.
    if (fake.callCount == 1) {
      callback(null, {
        Parameters: [ { Name: 'ssm/fakeappname/testing/key', Value: 'value' } ],
        NextToken: 'yep'
      })
    }
    else {
      callback(null, { Parameters: [ { Name: 'ssm/fakeappname/testing/key', Value: 'value' } ] })
    }
  })
  aws.mock('SSM', 'getParametersByPath', fake)
  all('fakeappname', function done (err, results) {
    if (err) t.error(err)
    else {
      t.equals(fake.callCount, 2, 'SSM.getParametersByPath called twice when next token is present')
      t.equals(results.length, 2, 'returned results from both pages')
    }
    aws.restore('SSM')
  })
})
