let test = require('tape')
let proxyquire = require('proxyquire')

let inv = (params, callback) => ( callback(null, { inv: { app: 'fakename' } }) )

let addRan = false
let removeRan = false
let addRemove = (params, callback) => {
  let { action } = params
  if (action === 'add') addRan = true
  if (action === 'remove') removeRan = true
  callback()
}

let getEnvRan = false
let getEnv = (params, callback) => {
  getEnvRan = true
  callback(null, [])
}

let printRan = false
let print = () => ( printRan = true )

let writeRan = false
let write = (params, callback) => {
  writeRan = true
  callback()
}

function reset () {
  addRan = false
  getEnvRan = false
  printRan = false
  removeRan = false
  writeRan = false
}

let env = proxyquire('../', {
  '@architect/inventory': inv,
  './src/_add-remove': addRemove,
  './src/_get-env': getEnv,
  './src/_print': print,
  './src/_write': write,
})

test('Env errors if provided an unrecognized action', t => {
  t.plan(1)
  env({ action: 'idk', inventory: {} }, function done (err) {
    if (err) t.ok(err, 'got an error when env called with incorrect options')
    else t.fail('no error returned when env called with incorrect options')
  })
})

test('Env prints and writes preferences on print', t => {
  t.plan(3)
  env({ action: 'print', inventory: {} }, function done (err) {
    if (err) t.error(err, 'unexpected error when calling env with no parameters')
    else {
      t.ok(getEnvRan, '`getEnv` invoked once')
      t.ok(printRan, '`print` invoked once')
      t.ok(writeRan, '`write` invoked once')
    }
    reset()
  })
})

test('Env invokes add, prints, and writes on a valid add request', t => {
  t.plan(4)
  let params = { action: 'add', env: 'production', name: 'foo', value: 'bar', inventory: {} }
  env(params, function done (err) {
    if (err) t.error(err, 'unexpected error when calling env with add parameters')
    else {
      t.ok(getEnvRan, '`getEnv` invoked once')
      t.ok(printRan, '`print` invoked once')
      t.ok(writeRan, '`write` invoked once')
      t.ok(addRan, '`add` invoked once')
    }
    reset()
  })
})

test('Env invokes remove, prints, and writes on a valid remove request', t => {
  t.plan(4)
  let params = { action: 'remove', env: 'production', name: 'foo', value: 'bar', inventory: {} }
  env(params, function done (err) {
    if (err) t.error(err, 'unexpected error when calling env with remove parameters')
    else {
      t.ok(getEnvRan, '`getEnv` invoked once')
      t.ok(printRan, '`print` invoked once')
      t.ok(writeRan, '`write` invoked once')
      t.ok(removeRan, '`remove` invoked once')
    }
    reset()
  })
})
