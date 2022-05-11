# Architect Env changelog

---

## [3.0.2] 2022-05-10

### Changed

- Updated dependencies; sub-dep `lambda-runtimes` adds `nodejs16.x`.

---

## [3.0.1] 2022-03-31

### Changed

- Updated dependencies

---

## [3.0.0] 2022-01-23

### Added

- Added ability to directly invoke `env` without `@architect/architect`


### Changed

- Breaking change: consolidated module API into single method
- Breaking change: no longer use `NODE_ENV`, deprecated in favor of `ARC_ENV`
- Breaking change: bare CLI arguments (e.g. `env add...`) as aliases to flags are no longer used
- Stop publishing to the GitHub Package registry
- Updated dependencies


### Fixed

- Fixed basic env var validation

---

## [2.0.6] 2021-11-16

### Changed

- Updated dependencies

---

## [2.0.5] 2021-10-12

### Changed

- Updated dependencies

---

## [2.0.3 - 2.0.4] 2021-09-14

### Changed

- Internal: Updated Architect Parser to v5
- Updated dependencies

---

## [2.0.0 - 2.0.2] 2021-07-26

### Added

- Warn if `ARC_APP_SECRET` is not set in production


### Changed

- Breaking change: removed support for Node.js 10.x (now EOL, and no longer available to created in AWS Lambda) and Node.js 12.x
- Updated dependencies

---

## [1.2.2 - 1.2.3] 2021-06-21

### Changed

- Updated dependencies

---

## [1.2.1] 2021-05-24

### Changed

- Updated dependencies

---

## [1.2.0] 2020-12-29

### Added

- Added new prompts:
  - Create a preferences file if one does not already exist
  - Add or update a `.gitignore` file (if project dir is a git repo)
  - Fixes #1033; thanks @rbethel!

---

## [1.1.1] 2020-12-04

### Changed

- Updated dependencies

---

## [1.1.0] 2020-11-23

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
