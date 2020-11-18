# Architect Env changelog

---

## [1.1.0] 2020-11-16

### Added

- Support for `preferences.arc` (and `prefs.arc`)
- Support for `.env`
- Gave `env` a much needed makeover! Some highlights:
  - Only prints the environment whose variables were changed (making it easier to see what happend in projects with lots of env vars)
  - Tidied up formatting and printing
  - Added some more helpful messages about what's going on
  - Exit gracefully instead of erroring when removing an env var that doesn't exist


### Changed

- Implemented Inventory (`@architect/inventory`)
- Updated dependencies
- Deprecated writing to `.arc-env` file

---

## [1.0.12] 2020-07-15

### Fixed

- Only quote env vars with special chars and floats

---

## [1.0.11] 2020-07-13

### Fixed

- Fixes .arc-env encoding of env vars with Architect-reserved characters

---

## [1.0.10] 2020-03-24

### Changed

- Updated dependencies

---

## [1.0.9] 2020-03-22

### Changed

- Updated dependencies

---

## [1.0.8] 2020-03-19

### Changed

- Updated dependencies

---

## [1.0.7] 2020-02-10

### Changed

- Removes validation from environment variable values, use whatever you like! Fixes #669, thanks @rbuckingham!

---

## [1.0.6] 2020-02-05

### Changed

- Updated dependencies

---
