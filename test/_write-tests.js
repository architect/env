const { test, mock } = require('node:test')
const assert = require('node:assert')
let write = require('../src/_write')
let fs = require('fs')
let { updater } = require('@architect/utils')
let update = updater('Env')
let params = { appname: 'fakeappname', update }

test('_write should write out env vars to a .arc-env file', () => {
  process.env.ARC_TESTING = true
  let fake = mock.fn()
  mock.method(fs, 'writeFileSync', fake)
  write({ envVars: [
    { env: 'testing', name: 'one', value: '1' },
    { env: 'staging', name: 'two', value: '2' },
    { env: 'production', name: 'three', value: '3' },
    { env: 'production', name: 'float', value: '1.23' },
    { env: 'production', name: 'aye', value: 'a' },
    { env: 'production', name: 'bee', value: 'b@b' },
    { env: 'production', name: 'cee', value: 'c#c' },
    { env: 'production', name: 'dee', value: 'dee1.23' },
    { env: 'production', name: 'eee', value: '1.23eee' },
  ], ...params } )
  let calls = fake.mock.calls
  let file = calls[0].arguments[1].split('\n').slice(1).join('\n') // Lop off the comment at the top of the block
  let contents = `@env
testing
  one 1

staging
  two 2

production
  three 3
  float "1.23"
  aye a
  bee "b@b"
  cee "c#c"
  dee dee1.23
  eee 1.23eee
`
  delete process.env.ARC_TESTING
  assert.ok(calls[0].arguments[0].endsWith('preferences.arc'), 'wrote to a file that ends in preferences.arc')
  assert.strictEqual(file, contents, 'All env vars were placed correctly in the preferences file')
  mock.restoreAll()
})
