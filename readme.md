# `@architect/env` [![GitHub CI status](https://github.com/architect/env/workflows/Node%20CI/badge.svg)](https://github.com/architect/env/actions?query=workflow%3A%22Node+CI%22)
<!-- [![codecov](https://codecov.io/gh/architect/env/branch/master/graph/badge.svg)](https://codecov.io/gh/architect/env) -->

[@architect/env][npm] reads and writes environment variables that are made immediately available to all deployed Functions. Use this tool to ensure your team and your application's deployment targets are in sync with sensitive configuration data (such as API keys) that needs to exist outside of your codebase.


# Installation

    npm install @architect/env

# Use of AWS SSM

This modules stores environment variables as [AWS SSM Parameters][param] using
[AWS SSM Parameter Store][paramstore]. [Parameters][param] are created such that:

- Each [Parameter][param]'s `Name` stores environment variables in the format `${appname}/${environment}/${variableName}`.
- Each [Parameter][param]'s `Value` stores the environment variable value.
- Each [Parameter][param]'s `Type` is set to `SecureString`.



[npm]: https://www.npmjs.com/package/@architect/env
[param]: https://docs.aws.amazon.com/systems-manager/latest/APIReference/API_Parameter.html
[paramstore]: https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-parameter-store.html
