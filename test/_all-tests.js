/* const { test, mock } = require('node:test')
const assert = require('node:assert')
let AWS = require('aws-sdk')
let aws = require('aws-sdk-mock')
aws.setSDKInstance(AWS)
let getEnv = require('../src/_get-env')
let { updater } = require('@architect/utils')

let update = updater('Env')
let params = { inventory: { inv: {
  app: 'appname',
  aws: { region: 'us-west-2' },
} }, update }

test('getEnv should callback with error if SSM errors', () => {
  let fake = mock.fn((query, callback) => callback({ boom: true }))
  aws.mock('SSM', 'getParametersByPath', fake)
  getEnv(params, function done (err) {
    if (err) assert.ok(err, 'got an error when SSM explodes')
    else assert.fail('no error returned when SSM explodes')
    aws.restore('SSM')
  })
})

test('getEnv should return massaged data from SSM', () => {
  let fake = mock.fn((query, callback) => callback(null, {
    Parameters: [ { Name: 'ssm/fakeappname/testing/key', Value: 'value' } ]
  }))
  aws.mock('SSM', 'getParametersByPath', fake)
  getEnv(params, function done (err, results) {
    if (err) {
      assert.fail('unexpected error callback when ssm returns proper data')
      console.log(err)
    }
    else assert.deepStrictEqual(results, [ { app: 'appname', env: 'testing', name: 'key', value: 'value' } ], 'got expected format for SSM env vars')
    aws.restore('SSM')
  })
})

test('getEnv should be able to handle paginated data from SSM', () => {
  let fake = mock.fn(function (query, callback) {
    // Only on the first call, provide a next token.
    if (fake.mock.callCount() === 1) {
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
  getEnv(params, function done (err, results) {
    if (err) {
      assert.fail('unexpected error')
      console.log(err)
    }
    else {
      assert.strictEqual(fake.mock.callCount(), 2, 'SSM.getParametersByPath called twice when next token is present')
      assert.strictEqual(results.length, 2, 'returned results from both pages')
    }
    aws.restore('SSM')
  })
})
 */
