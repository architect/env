let test = require('tape')
let sinon = require('sinon')
let write = require('../src/_write')
let fs = require('fs')

test('_write should write out env vars to a .arc-env file', t=> {
  t.plan(10)
  let fake = sinon.fake.returns()
  sinon.replace(fs, 'writeFileSync', fake)
  write([
    {env: 'testing', name: 'one', value: '1'},
    {env: 'staging', name: 'two', value: '2'},
    {env: 'production', name: 'three', value: '3'},
    {env: 'production', name: 'float', value: '1.23'},
    {env: 'production', name: 'aye', value: 'a'},
    {env: 'production', name: 'bee', value: 'b@b'},
    {env: 'production', name: 'cee', value: 'c#c'},
    {env: 'production', name: 'dee', value: 'dee1.23'},
    {env: 'production', name: 'eee', value: '1.23eee'},
  ])
  let args = fake.lastCall.args
  t.ok(args[0].endsWith('.arc-env'), 'wrote to a file that ends in .arc-env')
  t.ok(args[1].includes('@testing\none 1'), 'wrote testing env var to correct place in env file')
  t.ok(args[1].includes('@staging\ntwo 2'), 'wrote staging env var to correct place in env file')
  t.ok(args[1].includes('@production\nthree 3'), 'wrote production env var to correct place in env file')
  t.ok(args[1].includes('float "1.23"'), 'wrote production env var to correct place in env file')
  t.ok(args[1].includes('aye a'), 'wrote production env var to correct place in env file')
  t.ok(args[1].includes('bee "b@b"'), 'wrote production env var to correct place in env file')
  t.ok(args[1].includes('cee "c#c"'), 'wrote production env var to correct place in env file')
  t.ok(args[1].includes('dee dee1.23'), 'wrote production env var to correct place in env file')
  t.ok(args[1].includes('eee 1.23eee'), 'wrote production env var to correct place in env file')
});
