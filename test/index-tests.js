let test = require('tape')
let sinon = require('sinon')
let utils = require('@architect/utils')
let env = require('../')

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

test('env invokes all and printer submodules when run without arguments', t=> {
  t.plan(2)
  let readArc = sinon.fake.returns({arc:{app:['fakename']}})
  sinon.replace(utils, 'readArc', readArc)
  let fakeAll = sinon.fake.yields()
  let fakePrinter = sinon.fake.returns()
  sinon.replace(env, 'all', fakeAll)
  sinon.replace(env, 'printer', fakePrinter)
  env([], function done(err) {
    if (err) t.error(err, 'unexpected error when calling env with no parameters')
    else {
      t.ok(fakeAll.calledOnce, '`all` invoked once')
      t.ok(fakePrinter.calledOnce, '`printer` invoked once')
    }
    sinon.restore()
  })
});

test('env invokes add, all and printer submodules when run with three arguments (including proper env name)', t=> {
  t.plan(3)
  let readArc = sinon.fake.returns({arc:{app:['fakename']}})
  sinon.replace(utils, 'readArc', readArc)
  let fakeAll = sinon.fake.yields()
  let fakePrinter = sinon.fake.returns()
  let fakeAdd = sinon.fake.yields()
  sinon.replace(env, 'all', fakeAll)
  sinon.replace(env, 'printer', fakePrinter)
  sinon.replace(env, 'add', fakeAdd)
  env(['production', 'foo', 'bar'], function done(err) {
    if (err) t.error(err, 'unexpected error when calling env with add parameters')
    else {
      t.ok(fakeAll.calledOnce, '`all` invoked once')
      t.ok(fakePrinter.calledOnce, '`printer` invoked once')
      t.ok(fakeAdd.calledOnce, '`add` invoked once')
    }
    sinon.restore()
  })
});

test('env invokes remove, all and printer submodules when run with three arguments (including remove as first arg)', t=> {
  t.plan(3)
  let readArc = sinon.fake.returns({arc:{app:['fakename']}})
  sinon.replace(utils, 'readArc', readArc)
  let fakeAll = sinon.fake.yields()
  let fakePrinter = sinon.fake.returns()
  let fakeRemove = sinon.fake.yields()
  sinon.replace(env, 'all', fakeAll)
  sinon.replace(env, 'printer', fakePrinter)
  sinon.replace(env, 'remove', fakeRemove)
  env(['remove', 'production', 'foo'], function done(err) {
    if (err) t.error(err, 'unexpected error when calling env with remove parameters')
    else {
      t.ok(fakeAll.calledOnce, '`all` invoked once')
      t.ok(fakePrinter.calledOnce, '`printer` invoked once')
      t.ok(fakeRemove.calledOnce, '`remove` invoked once')
    }
    sinon.restore()
  })
});
