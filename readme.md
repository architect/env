# `@architect/env` [![GitHub CI status](https://github.com/architect/env/workflows/Node%20CI/badge.svg)](https://github.com/architect/env/actions?query=workflow%3A%22Node+CI%22)
<!-- [![codecov](https://codecov.io/gh/architect/env/branch/master/graph/badge.svg)](https://codecov.io/gh/architect/env) -->

[@architect/env][npm] reads and writes environment variables that are made immediately available to all deployed Functions. Sensitive configuration data, such as API keys, needs to happen outside of the codebase in revision control and you can use this tool to ensure an entire team and the deployment targets are in sync.

# Installation

    npm install @architect/env

# Use of AWS SSM

This modules stores environment variables as [AWS SSM Parameters][param] using
[AWS SSM Parameter Store][paramstore]. [Parameters][param] are created such that:

- each [Parameter][param]'s `Name` stores environment variables in the format `${appname}/${environment}/${variableName}`.
- each [Parameter][param]'s `Value` stores the environment variable value.
- each [Parameter][param]'s `Type` is set to `SecureString`.

# API

## `env(options, callback)`

Reads, writes and/or prints environment variables based on the contents of `opts`.

`opts` is an array. If no callback is provided, returns a Promise.

If `opts` is the empty array, invokes [`env.all`][all], prints the results via [`env.print`][print] and writes them to disk using [`env.write`][write].

if `opts` is an array of three elements and the first element is one of the strings `testing`, `staging` or `production`, will invoke [`env.add`][add].

if `opts` is an array of three elements and the first element is one of the strings `remove`, `--remove` or `-r`, will invoke [`env.remove`][remove].


## `env.all(appname, callback)`

Queries SSM's [`getParametersByPath`][getparams], providing the arc `appname` as the `Path` parameter.

## `env.add(appname, opts, callback)`

Adds an environment variable to the system using SSM's [`putParameter`][putparam], overwriting any [Parameter][param] with the same `Name`. `opts` should be an array of three elements:

1. The first element must be the environment, one of `testing`, `staging`, or `production`.
2. The second element must be the environment variable name. The name must be all caps and may contain underscores. It cannot be a [reserved word][reserved].
3. The third element must be the environment variable value. The value must be alphanumeric.


## `env.remove(appname, opts, callback)`

Removes an environment variable from the system using SSM's [`deleteParameter`][deleteparam].
`opts` should be an array of three elements:

1. The first element is ignored.
2. The second element must be the environment variable name. The name must be all caps and may contain underscores. It cannot be a [reserved word][reserved].
3. The third element must be the environment variable value. The value must be alphanumeric.


## `env.print(error, result)`

Pretty-prints environment variables and errors.


## `env.write(result, callback)`

Writes `result` into an `preferences.arc` file in the current working directory in a format that lists out all environment variables per `testing`, `staging` and
`production` environments.


[npm]: https://www.npmjs.com/package/@architect/env
[all]: #envallappnamecallback
[print]: #envprinterrorresult
[add]: #envaddappnameoptscallback
[remove]: #envremoveappnameoptscallback
[paramstore]: https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-parameter-store.html
[param]: https://docs.aws.amazon.com/systems-manager/latest/APIReference/API_Parameter.html
[getparams]: https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SSM.html#getParametersByPath-property
[putparam]: https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SSM.html#putParameter-property
[deleteparam]: https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SSM.html#deleteParameter-property
[reserved]: https://github.com/architect/env/blob/master/src/_is-reserved.js#L2
