aio-cli-plugin-ims
==================

The IMS plugin to aio supports accessing IMS API using access tokens provided by the [Adobe I/O Auth](https://github.com/adobe/aio-cli-plugin-auth) plugin.

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@adobe/aio-cli-plugin-ims.svg)](https://npmjs.org/package/@adobe/aio-cli-plugin-ims)
[![Downloads/week](https://img.shields.io/npm/dw/@adobe/aio-cli-plugin-ims.svg)](https://npmjs.org/package/@adobe/aio-cli-plugin-ims)
[![Build Status](https://travis-ci.com/adobe/aio-cli-plugin-ims.svg?branch=master)](https://travis-ci.com/adobe/aio-cli-plugin-ims)
[![License](https://img.shields.io/npm/l/@adobe/aio-cli-plugin-ims.svg)](https://github.com/adobe/aio-cli-plugin-ims/blob/master/package.json)
[![Codecov Coverage](https://img.shields.io/codecov/c/github/adobe/aio-cli-plugin-ims/master.svg?style=flat-square)](https://codecov.io/gh/adobe/aio-cli-plugin-ims/)


<!-- toc -->
* [How it works](#how-it-works)
* [PS](#ps)
* [Usage](#usage)
* [Commands](#commands)
* [Contributing](#contributing)
* [Licensing](#licensing)
<!-- tocstop -->

# How it works

This _Adobe IO CLI IMS Plugin_ builds upon the Auth plugin and the IMS library to provide three kinds of APIs:

* Managing token access plugins through the CLI. The IMS library provides the core support for token access plugins. And plugins themselves should register and unregister themselves upon installation and removal. The `plugins` command allows to also manage the list of plugins through the CLI. This is mostly interesting for inspecting that list.
* Getting information from IMS through various APIs such as the user profile, organization set, and session. The set of such commands is growing as per need and request.
* Providing low level `GET` and `POST` request access to any API provided on the command line. This is very low level and little support can be offered.


# PS

Oh, and yes, docs and tests are a bit lacking this time ... I want to just get this out ASAP for anyone to have a look.

# Usage
```sh-session
$ aio plugins:install -g @adobe/aio-cli-plugin-ims
$ # OR
$ aio discover -i
$ aio ims --help
```

# Commands
<!-- commands -->
* [`aio ims`](#aio-ims)
* [`aio ims:account_cluster`](#aio-imsaccount_cluster)
* [`aio ims:clientid`](#aio-imsclientid)
* [`aio ims:get API`](#aio-imsget-api)
* [`aio ims:organizations`](#aio-imsorganizations)
* [`aio ims:plugins [PLUGIN]`](#aio-imsplugins-plugin)
* [`aio ims:post API`](#aio-imspost-api)
* [`aio ims:profile`](#aio-imsprofile)
* [`aio ims:session`](#aio-imssession)

## `aio ims`

IMS commands to login and logout.

```
IMS commands to login and logout.

The main commands are ims:login to get or create an access token and
ims:logout to invalidate an access token and thus log out from IMS.

Logging in and out is based on configuration of which there may be
multiple. Each set of configuration properties, called an IMS context,
can be individually addressed by a label.

Configuration for the IMS commands is stored in the "ims"
configuration property. The special property "ims.config.current" contains the
label of the current configuration which can be set using the
"aio ims ctx -s <label>" command.

Each set of properties in labeled IMS context configurations has
configuration properties depending on the kind of access that is
supported. The below example shows the configuration for OAuth2
based (graphical SUSI) login.

The "env" property is mandatory and designates the IMS environment
used for authentication. Possible values are "stage" and "prod".
If the property is missing or any other value, it defaults to "stage".

All commands allow their normal output to be formatted in either
HJSON (default), JSON, or YAML.


USAGE
  $ aio ims

DESCRIPTION
  The main commands are ims:login to get or create an access token and
  ims:logout to invalidate an access token and thus log out from IMS.

  Logging in and out is based on configuration of which there may be
  multiple. Each set of configuration properties, called an IMS context,
  can be individually addressed by a label.

  Configuration for the IMS commands is stored in the "ims"
  configuration property. The special property "ims.config.current" contains the
  label of the current configuration which can be set using the
  "aio ims ctx -s <label>" command.

  Each set of properties in labeled IMS context configurations has
  configuration properties depending on the kind of access that is
  supported. The below example shows the configuration for OAuth2
  based (graphical SUSI) login.

  The "env" property is mandatory and designates the IMS environment
  used for authentication. Possible values are "stage" and "prod".
  If the property is missing or any other value, it defaults to "stage".

  All commands allow their normal output to be formatted in either
  HJSON (default), JSON, or YAML.

EXAMPLE
  {
       ims: {
         contexts: {
           postman: {
             env: "stage",
             callback_url: "https://callback.example.com",
             client_id: "example.com-client-id",
             client_secret: "XXXXXXXX",
             scope: "openid AdobeID additional_info.projectedProductContext read_organizations",
             state: ""
           }
         },
         config: {
           current: "postman"
         }
       }
     }
```

_See code: [src/commands/ims/index.js](https://github.com/adobe/aio-cli-plugin-ims/blob/v2.9.0/src/commands/ims/index.js)_

## `aio ims:account_cluster`

Retrieve the user's account cluster

```
Retrieve the user's account cluster
The token must have the "account_cluster.read" scope for this API to
be successful.

The API result is printed as an object if successful. If the call
fails, the error message is returned as an error.



USAGE
  $ aio ims:account_cluster

OPTIONS
  -c, --ctx=ctx    Name of the Adobe IMS context to use. Default is the current Adobe IMS context
  -d, --data=data  Request parameter in the form of name=value. Repeat for multiple parameters
  -g, --global     global config
  -l, --local      local config
  -v, --verbose    Verbose output
  --debug=debug    Debug level output

DESCRIPTION
  The token must have the "account_cluster.read" scope for this API to
  be successful.

  The API result is printed as an object if successful. If the call
  fails, the error message is returned as an error.
```

_See code: [src/commands/ims/account_cluster.js](https://github.com/adobe/aio-cli-plugin-ims/blob/v2.9.0/src/commands/ims/account_cluster.js)_

## `aio ims:clientid`

Log in with a certain IMS context and returns the client ID.

```
Log in with a certain IMS context and returns the client ID.

The client ID is the value of 'client_id' property of the IMS token payload
and can also be used as the API key, the x-api-key request header, for API
calls using the token.

See 'aio ims:login --help' for details on how to acquire an access token


USAGE
  $ aio ims:clientid

OPTIONS
  -c, --ctx=ctx  Name of the Adobe IMS context to use. Default is the current Adobe IMS context
  -g, --global   global config
  -l, --local    local config
  -v, --verbose  Verbose output
  --debug=debug  Debug level output

DESCRIPTION
  The client ID is the value of 'client_id' property of the IMS token payload
  and can also be used as the API key, the x-api-key request header, for API
  calls using the token.

  See 'aio ims:login --help' for details on how to acquire an access token
```

_See code: [src/commands/ims/clientid.js](https://github.com/adobe/aio-cli-plugin-ims/blob/v2.9.0/src/commands/ims/clientid.js)_

## `aio ims:get API`

Call an IMS API using a GET request

```
Call an IMS API using a GET request

This is a raw and low level IMS API call command taking the IMS API
path as the first argument and any additional request parameters
as optional additional arguments.

The API result is printed as an object if successful. If the call
fails, the error message is returned as an error.



USAGE
  $ aio ims:get API

ARGUMENTS
  API  The IMS API to call, for example: /ims/profile/v1

OPTIONS
  -c, --ctx=ctx    Name of the Adobe IMS context to use. Default is the current Adobe IMS context
  -d, --data=data  Request parameter in the form of name=value. Repeat for multiple parameters
  -g, --global     global config
  -l, --local      local config
  -v, --verbose    Verbose output
  --debug=debug    Debug level output

DESCRIPTION
  This is a raw and low level IMS API call command taking the IMS API
  path as the first argument and any additional request parameters
  as optional additional arguments.

  The API result is printed as an object if successful. If the call
  fails, the error message is returned as an error.
```

_See code: [src/commands/ims/get.js](https://github.com/adobe/aio-cli-plugin-ims/blob/v2.9.0/src/commands/ims/get.js)_

## `aio ims:organizations`

Retrieve the organizations to which the user is associated

```
Retrieve the organizations to which the user is associated

The API result is printed as an object if successful. If the call
fails, the error message is returned as an error.



USAGE
  $ aio ims:organizations

OPTIONS
  -c, --ctx=ctx    Name of the Adobe IMS context to use. Default is the current Adobe IMS context
  -d, --data=data  Request parameter in the form of name=value. Repeat for multiple parameters
  -g, --global     global config
  -l, --local      local config
  -v, --verbose    Verbose output
  --debug=debug    Debug level output

DESCRIPTION
  The API result is printed as an object if successful. If the call
  fails, the error message is returned as an error.
```

_See code: [src/commands/ims/organizations.js](https://github.com/adobe/aio-cli-plugin-ims/blob/v2.9.0/src/commands/ims/organizations.js)_

## `aio ims:plugins [PLUGIN]`

Manage Create Token Plugins.

```
Manage Create Token Plugins.

The following options exist for this command:

* Print the current list of token creation plugins
* Update the list of token creation plugins

Note: If providing a list of plugis to configure, they are not currently
checked for existence or implementation of the correct contract.

The list of plugins is returned as an array of module names unless the
--modules flag indicates to also return the paths to the module files.
With the --modules flag, the result is an array of objects with two
properties:

* plugin     -- Configured plugin name
* moduleFile -- Absolute path of the file loaded for the plugin. This
                property is only returned if the plugin can be resolved.
* error      -- Reason for not being able to load the plugin. This
                property is only returned if the plugin cannot be resolved.


USAGE
  $ aio ims:plugins [PLUGIN]

ARGUMENTS
  PLUGIN  List of plugins to configure. If not provided, prints the current list instead

OPTIONS
  -c, --ctx=ctx  Name of the Adobe IMS context to use. Default is the current Adobe IMS context
  -f, --force    Force configuring the list of plugins without checking for existence or contract
  -g, --global   global config
  -l, --local    local config
  -m, --module   Show the module file loaded for each plugin
  -v, --verbose  Verbose output
  --debug=debug  Debug level output

DESCRIPTION
  The following options exist for this command:

  * Print the current list of token creation plugins
  * Update the list of token creation plugins

  Note: If providing a list of plugis to configure, they are not currently
  checked for existence or implementation of the correct contract.

  The list of plugins is returned as an array of module names unless the
  --modules flag indicates to also return the paths to the module files.
  With the --modules flag, the result is an array of objects with two
  properties:

  * plugin     -- Configured plugin name
  * moduleFile -- Absolute path of the file loaded for the plugin. This
                   property is only returned if the plugin can be resolved.
  * error      -- Reason for not being able to load the plugin. This
                   property is only returned if the plugin cannot be resolved.
```

_See code: [src/commands/ims/plugins.js](https://github.com/adobe/aio-cli-plugin-ims/blob/v2.9.0/src/commands/ims/plugins.js)_

## `aio ims:post API`

Call an IMS API using a POST request

```
Call an IMS API using a POST request

This is a raw and low level IMS API call command taking the IMS API
path as the first argument and any additional request parameters
as optional additional arguments.

The API result is printed as an object if successful. If the call
fails, the error message is returned as an error.



USAGE
  $ aio ims:post API

ARGUMENTS
  API  The IMS API to call, for example: /ims/profile/v1

OPTIONS
  -c, --ctx=ctx    Name of the Adobe IMS context to use. Default is the current Adobe IMS context
  -d, --data=data  Request parameter in the form of name=value. Repeat for multiple parameters
  -g, --global     global config
  -l, --local      local config
  -v, --verbose    Verbose output
  --debug=debug    Debug level output

DESCRIPTION
  This is a raw and low level IMS API call command taking the IMS API
  path as the first argument and any additional request parameters
  as optional additional arguments.

  The API result is printed as an object if successful. If the call
  fails, the error message is returned as an error.
```

_See code: [src/commands/ims/post.js](https://github.com/adobe/aio-cli-plugin-ims/blob/v2.9.0/src/commands/ims/post.js)_

## `aio ims:profile`

Retrieve the IMS Profile (for a user token)

```
Retrieve the IMS Profile (for a user token)

The API result is printed as an object if successful. If the call
fails, the error message is returned as an error.



USAGE
  $ aio ims:profile

OPTIONS
  -c, --ctx=ctx    Name of the Adobe IMS context to use. Default is the current Adobe IMS context
  -d, --data=data  Request parameter in the form of name=value. Repeat for multiple parameters
  -g, --global     global config
  -l, --local      local config
  -v, --verbose    Verbose output
  --debug=debug    Debug level output

DESCRIPTION
  The API result is printed as an object if successful. If the call
  fails, the error message is returned as an error.
```

_See code: [src/commands/ims/profile.js](https://github.com/adobe/aio-cli-plugin-ims/blob/v2.9.0/src/commands/ims/profile.js)_

## `aio ims:session`

Retrieve the IMS Profile (for a user token)

```
Retrieve the IMS Profile (for a user token)

The API result is printed as an object if successful. If the call
fails, the error message is returned as an error.



USAGE
  $ aio ims:session

OPTIONS
  -c, --ctx=ctx    Name of the Adobe IMS context to use. Default is the current Adobe IMS context
  -d, --data=data  Request parameter in the form of name=value. Repeat for multiple parameters
  -g, --global     global config
  -l, --local      local config
  -v, --verbose    Verbose output
  --debug=debug    Debug level output

DESCRIPTION
  The API result is printed as an object if successful. If the call
  fails, the error message is returned as an error.
```

_See code: [src/commands/ims/session.js](https://github.com/adobe/aio-cli-plugin-ims/blob/v2.9.0/src/commands/ims/session.js)_
<!-- commandsstop -->


# Contributing
Contributions are welcomed! Read the [Contributing Guide](CONTRIBUTING.md) for more information.


# Licensing

This project is licensed under the Apache V2 License. See [LICENSE](LICENSE) for more information.
