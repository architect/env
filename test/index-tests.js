let test = require('tape')
let sinon = require('sinon')
let utils = require('@architect/utils')
let env = require('../')
process.env.AWS_REGION = 'us-west-1'

test('env errors if provided an unrecognized command', t=> {
  t.plan(1)
  let readArc = sinon.fake.returns({arc:{app:['fakename']}})
  sinon.replace(utils, 'readArc', readArc)
  env(['poop'], function done(err) {
    if (err) t.ok(err, 'got an error when env called with incorrect options')
    else t.fail('no error returned when env called with incorrect options')
    sinon.restore()
  })
});

test('env invokes all, write and print submodules when run without arguments', t=> {
  t.plan(3)
  let readArc = sinon.fake.returns({arc:{app:['fakename']}})
  sinon.replace(utils, 'readArc', readArc)
  let fakeAll = sinon.fake.yields(null, [])
  let fakePrint = sinon.fake.returns()
  let fakeWrite = sinon.fake.returns()
  sinon.replace(env, 'all', fakeAll)
  sinon.replace(env, 'print', fakePrint)
  sinon.replace(env, 'write', fakeWrite)
  env([], function done(err) {
    if (err) t.error(err, 'unexpected error when calling env with no parameters')
    else {
      t.ok(fakeAll.calledOnce, '`all` invoked once')
      t.ok(fakePrint.calledOnce, '`print` invoked once')
      t.ok(fakeWrite.calledOnce, '`write` invoked once')
    }
    sinon.restore()
  })
});

test('env invokes add, all, write and print submodules when run with three arguments (including proper env name)', t=> {
  t.plan(4)
  let readArc = sinon.fake.returns({arc:{app:['fakename']}})
  sinon.replace(utils, 'readArc', readArc)
  let fakeAll = sinon.fake.yields(null, [])
  let fakePrint = sinon.fake.returns()
  let fakeWrite = sinon.fake.returns()
  let fakeAdd = sinon.fake.yields()
  sinon.replace(env, 'all', fakeAll)
  sinon.replace(env, 'print', fakePrint)
  sinon.replace(env, 'write', fakeWrite)
  sinon.replace(env, 'add', fakeAdd)
  env(['production', 'foo', 'bar'], function done(err) {
    if (err) t.error(err, 'unexpected error when calling env with add parameters')
    else {
      t.ok(fakeAll.calledOnce, '`all` invoked once')
      t.ok(fakePrint.calledOnce, '`print` invoked once')
      t.ok(fakeWrite.calledOnce, '`write` invoked once')
      t.ok(fakeAdd.calledOnce, '`add` invoked once')
    }
    sinon.restore()
  })
});

test('env invokes remove, all, write and print submodules when run with three arguments (including remove as first arg)', t=> {
  t.plan(4)
  let readArc = sinon.fake.returns({arc:{app:['fakename']}})
  sinon.replace(utils, 'readArc', readArc)
  let fakeAll = sinon.fake.yields(null, [])
  let fakePrint = sinon.fake.returns()
  let fakeWrite = sinon.fake.returns()
  let fakeRemove = sinon.fake.yields()
  sinon.replace(env, 'all', fakeAll)
  sinon.replace(env, 'print', fakePrint)
  sinon.replace(env, 'write', fakeWrite)
  sinon.replace(env, 'remove', fakeRemove)
  env(['remove', 'production', 'foo'], function done(err) {
    if (err) t.error(err, 'unexpected error when calling env with remove parameters')
    else {
      t.ok(fakeAll.calledOnce, '`all` invoked once')
      t.ok(fakePrint.calledOnce, '`print` invoked once')
      t.ok(fakeWrite.calledOnce, '`write` invoked once')
      t.ok(fakeRemove.calledOnce, '`remove` invoked once')
    }
    sinon.restore()
    delete process.env.AWS_REGION
  })
});
