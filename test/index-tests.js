let test = require('tape')
let proxyquire = require('proxyquire')

let addRan = false
let removeRan = false
let addRemove = (params, aws, callback) => {
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
  './_add-remove': addRemove,
  './_get-env': getEnv,
  './_print': print,
  './_write': write,
})

let inventory = { inv: {
  app: 'fakename',
  aws: { region: 'us-west-2' },
} }

test('Set up env', t => {
  t.plan(1)
  process.env.AWS_ACCESS_KEY_ID = 'dummy'
  process.env.AWS_SECRET_ACCESS_KEY = 'dummy'
  t.pass('Set up dummy creds')
})

test('Env errors if provided an unrecognized action', t => {
  t.plan(1)
  env({ action: 'idk', inventory }, function done (err) {
    if (err) t.ok(err, 'got an error when env called with incorrect options')
    else t.fail('no error returned when env called with incorrect options')
  })
})

test('Env prints and writes preferences on print', t => {
  t.plan(3)
  env({ action: 'print', inventory }, function done (err) {
    if (err) {
      t.fail('unexpected error when calling env with no parameters')
      console.log(err)
    }
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
  let params = { action: 'add', env: 'production', name: 'foo', value: 'bar', inventory }
  env(params, function done (err) {
    if (err) {
      t.fail('unexpected error when calling env with add parameters')
      console.log(err)
    }
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
  let params = { action: 'remove', env: 'production', name: 'foo', value: 'bar', inventory }
  env(params, function done (err) {
    if (err) {
      t.fail('unexpected error when calling env with remove parameters')
      console.log(err)
    }
    else {
      t.ok(getEnvRan, '`getEnv` invoked once')
      t.ok(printRan, '`print` invoked once')
      t.ok(writeRan, '`write` invoked once')
      t.ok(removeRan, '`remove` invoked once')
    }
    reset()
  })
})

test('Tear down env', t => {
  t.plan(1)
  delete process.env.AWS_ACCESS_KEY_ID
  delete process.env.AWS_SECRET_ACCESS_KEY
  t.pass('Destroyed dummy creds')
})
