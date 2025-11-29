const { test } = require('node:test')
const assert = require('node:assert')
const fs = require('fs')
const path = require('path')

test('package.json does not contain removed dependencies', () => {
  const packageJsonPath = path.join(__dirname, '..', 'package.json')
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))

  const removedDeps = [ 'tape', 'nyc', 'tap-arc', 'cross-env', 'sinon', 'proxyquire' ]
  const allDeps = {
    ...packageJson.dependencies,
    ...packageJson.devDependencies,
  }

  removedDeps.forEach(dep => {
    assert.ok(!allDeps[dep], `${dep} should not be in dependencies`)
  })
})

test('all test files use node:test and node:assert', () => {
  const testDir = path.join(__dirname)
  const testFiles = fs.readdirSync(testDir)
    .filter(file => file.endsWith('-tests.js'))
    .filter(file => file !== 'migration-verification-tests.js') // Skip this verification file

  assert.ok(testFiles.length > 0, 'should find test files')

  testFiles.forEach(file => {
    const filePath = path.join(testDir, file)
    const content = fs.readFileSync(filePath, 'utf8')

    // Check for node:test import
    assert.ok(
      content.includes("require('node:test')") || content.includes('require("node:test")'),
      `${file} should import node:test`,
    )

    // Check for node:assert import
    assert.ok(
      content.includes("require('node:assert')") || content.includes('require("node:assert")'),
      `${file} should import node:assert`,
    )

    // Should not import tape
    assert.ok(
      !content.includes("require('tape')") && !content.includes('require("tape")'),
      `${file} should not import tape`,
    )
  })
})

test('no tape assertions remain in test files', () => {
  const testDir = path.join(__dirname)
  const testFiles = fs.readdirSync(testDir)
    .filter(file => file.endsWith('-tests.js'))
    .filter(file => file !== 'migration-verification-tests.js') // Skip this verification file

  const tapeAssertions = [
    /\bt\.plan\(/,
    /\bt\.ok\(/,
    /\bt\.equal\(/,
    /\bt\.deepEqual\(/,
    /\bt\.match\(/,
    /\bt\.pass\(/,
    /\bt\.fail\(/,
  ]

  testFiles.forEach(file => {
    const filePath = path.join(testDir, file)
    const content = fs.readFileSync(filePath, 'utf8')

    // Remove comments to avoid false positives from commented code
    const uncommentedContent = content
      .split('\n')
      .filter(line => !line.trim().startsWith('//'))
      .join('\n')
      .replace(/\/\*[\s\S]*?\*\//g, '')

    tapeAssertions.forEach(assertion => {
      assert.ok(
        !assertion.test(uncommentedContent),
        `${file} should not contain tape assertion ${assertion}`,
      )
    })
  })
})

test('no sinon or proxyquire usage remains in test files', () => {
  const testDir = path.join(__dirname)
  const testFiles = fs.readdirSync(testDir)
    .filter(file => file.endsWith('-tests.js'))
    .filter(file => file !== 'migration-verification-tests.js') // Skip this verification file

  testFiles.forEach(file => {
    const filePath = path.join(testDir, file)
    const content = fs.readFileSync(filePath, 'utf8')

    // Remove comments to avoid false positives from commented code
    const uncommentedContent = content
      .split('\n')
      .filter(line => !line.trim().startsWith('//'))
      .join('\n')
      .replace(/\/\*[\s\S]*?\*\//g, '')

    // Check for sinon usage
    assert.ok(
      !uncommentedContent.includes("require('sinon')") && !uncommentedContent.includes('require("sinon")'),
      `${file} should not import sinon`,
    )
    assert.ok(
      !/\bsinon\./g.test(uncommentedContent),
      `${file} should not use sinon methods`,
    )

    // Check for proxyquire usage
    assert.ok(
      !uncommentedContent.includes("require('proxyquire')") && !uncommentedContent.includes('require("proxyquire")'),
      `${file} should not import proxyquire`,
    )
    assert.ok(
      !/\bproxyquire\(/g.test(uncommentedContent),
      `${file} should not use proxyquire`,
    )
  })
})

test('npm scripts are correctly configured', () => {
  const packageJsonPath = path.join(__dirname, '..', 'package.json')
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))

  const scripts = packageJson.scripts

  // Verify test:unit script
  assert.ok(
    scripts['test:unit'].includes('node --test'),
    'test:unit should use node --test',
  )
  assert.ok(
    scripts['test:unit'].includes('test/**/*-tests.js'),
    'test:unit should use test/**/*-tests.js pattern',
  )

  // Verify coverage script
  assert.ok(
    scripts.coverage.includes('node --test'),
    'coverage should use node --test',
  )
  assert.ok(
    scripts.coverage.includes('--experimental-test-coverage'),
    'coverage should use --experimental-test-coverage flag',
  )
  assert.ok(
    scripts.coverage.includes('test/**/*-tests.js'),
    'coverage should use test/**/*-tests.js pattern',
  )

  // Verify test script
  assert.ok(
    scripts.test.includes('lint') && scripts.test.includes('coverage'),
    'test script should run lint and coverage',
  )

  // Verify test:nolint script
  assert.ok(
    scripts['test:nolint'].includes('coverage'),
    'test:nolint should run coverage',
  )
  assert.ok(
    !scripts['test:nolint'].includes('lint'),
    'test:nolint should not run lint',
  )
})
