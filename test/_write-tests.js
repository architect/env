let test = require('tape')
let sinon = require('sinon')
let write = require('../src/_write')
let fs = require('fs')

test('_write should write out env vars to a .arc-env file', t=> {
  t.plan(4)
  let fake = sinon.fake.returns()
  sinon.replace(fs, 'writeFileSync', fake)
  write([
    {env: 'testing', name: 'one', value: '1'},
    {env: 'staging', name: 'two', value: '2'},
    {env: 'production', name: 'three', value: '3'},
  ])
  let args = fake.lastCall.args
  t.ok(args[0].endsWith('.arc-env'), 'wrote to a file that ends in .arc-env')
  t.ok(args[1].includes('@testing\none 1'), 'wrote testing env var to correct place in env file')
  t.ok(args[1].includes('@staging\ntwo 2'), 'wrote staging env var to correct place in env file')
  t.ok(args[1].includes('@production\nthree 3'), 'wrote production env var to correct place in env file')
});
