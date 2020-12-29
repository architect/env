let test = require('tape')
// let sinon = require('sinon')
let proxyquire = require('proxyquire')

let inv = (params, callback) => ( callback(null, { inv: { app: 'fakename' } }) )

let addRan = false
let add = (params, opts, callback) => {
  addRan = true
  callback()
}

let allRan = false
let all = (params, callback) => {
  allRan = true
  callback(null, [])
}

let printRan = false
let print = () => ( printRan = true )

let removeRan = false
let remove = (params, opts, callback) => {
  removeRan = true
  callback()
}

let writeRan = false
let write = (params, callback) => {
  writeRan = true
  callback()
}

function reset () {
  addRan = false
  allRan = false
  printRan = false
  removeRan = false
  writeRan = false
}

let env = proxyquire('../', {
  '@architect/inventory': inv,
  './src/_add': add,
  './src/_all': all,
  './src/_print': print,
  './src/_remove': remove,
  './src/_write': write,
})
process.env.AWS_REGION = 'us-west-1'

test('env errors if provided an unrecognized command', t => {
  t.plan(1)
  env([ 'poop' ], function done (err) {
    if (err) t.ok(err, 'got an error when env called with incorrect options')
    else t.fail('no error returned when env called with incorrect options')
  })
})

test('env invokes all, write and print submodules when run without arguments', t => {
  t.plan(3)
  env([], function done (err) {
    if (err) t.error(err, 'unexpected error when calling env with no parameters')
    else {
      t.ok(allRan, '`all` invoked once')
      t.ok(printRan, '`print` invoked once')
      t.ok(writeRan, '`write` invoked once')
    }
    reset()
  })
})

test('env invokes add, all, write and print submodules when run with three arguments (including proper env name)', t => {
  t.plan(4)
  env([ 'production', 'foo', 'bar' ], function done (err) {
    if (err) t.error(err, 'unexpected error when calling env with add parameters')
    else {
      t.ok(allRan, '`all` invoked once')
      t.ok(printRan, '`print` invoked once')
      t.ok(writeRan, '`write` invoked once')
      t.ok(addRan, '`add` invoked once')
    }
    reset()
  })
})

test('env invokes remove, all, write and print submodules when run with three arguments (including remove as first arg)', t => {
  t.plan(4)
  env([ 'remove', 'production', 'foo' ], function done (err) {
    if (err) t.error(err, 'unexpected error when calling env with remove parameters')
    else {
      t.ok(allRan, '`all` invoked once')
      t.ok(printRan, '`print` invoked once')
      t.ok(writeRan, '`write` invoked once')
      t.ok(removeRan, '`remove` invoked once')
    }
    reset()
    delete process.env.AWS_REGION
  })
})
