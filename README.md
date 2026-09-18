aio-cli-plugin-ims
==================

# DEPRECATED IN FAVOR OF THE [AUTH PLUGIN](https://github.com/adobe/aio-cli-plugin-auth)

The IMS plugin to aio supports managing tokens for IMS such as login, logout, and retrieving and using tokens.

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@adobe/aio-cli-plugin-ims.svg)](https://npmjs.org/package/@adobe/aio-cli-plugin-ims)
[![Downloads/week](https://img.shields.io/npm/dw/@adobe/aio-cli-plugin-ims.svg)](https://npmjs.org/package/@adobe/aio-cli-plugin-ims)
[![Build Status](https://travis-ci.com/adobe/aio-cli-plugin-ims.svg?branch=master)](https://travis-ci.com/adobe/aio-cli-plugin-ims)
[![License](https://img.shields.io/npm/l/@adobe/aio-cli-plugin-ims.svg)](https://github.com/adobe/aio-cli-plugin-ims/blob/master/package.json)
[![Codecov Coverage](https://img.shields.io/codecov/c/github/adobe/aio-cli-plugin-ims/master.svg?style=flat-square)](https://codecov.io/gh/adobe/aio-cli-plugin-ims/)


<!-- toc -->
* [DEPRECATED IN FAVOR OF THE [AUTH PLUGIN](https://github.com/adobe/aio-cli-plugin-auth)](#deprecated-in-favor-of-the-auth-pluginhttpsgithubcomadobeaio-cli-plugin-auth)
* [Motivation](#motivation)
* [Goals](#goals)
* [The JavaScript Packages](#the-javascript-packages)
* [How it works](#how-it-works)
* [PS](#ps)
* [Usage](#usage)
* [Commands](#commands)
* [Contributing](#contributing)
* [Licensing](#licensing)
<!-- tocstop -->

# Motivation

IMS integration for authentication and subsequent use of the CLI for service access is critical to the success of the CLI. To that avail, this functionality needs to be as complete as to support anything the browser UI supports as well. In the end, this means support for logging in not only with JWT tokens for technical accounts but also leveraging the SUSI flow for three-legged user based authentication and even, at least for Adobe internal teams, with service tokens.

The current [JWT Auth Plugin for the Adobe I/O CLI](https://github.com/adobe/aio-cli-plugin-jwt-auth) does a decent job supporting JWT based flows with some limitations, though:

* Only a single configuration is supported, thus not allowing to switch for different configurations and thus different setups depending on the actual CLI task at hand. Even with the new local configuration support we are still limited to one configuration per local environment.
* The configuration contains a lot of boiler plate data, which is the same for many configurations. This also makes the configuration hard to manage.
* Only JWT tokens are supported. So we are missing real user tokens created using the SUSI UI based flow as well as service tokens, which are sometimes used by Adobe internal teams.
* The actual JWT signing and token exchange are not easily re-usable outside of the CLI plugin.

# Goals

So the goal of this project along with the companion repositories is to provide more complete support:

* Have a separate module implementing a JavaScript interface to the IMS API, so that this IMS API can be leveraged from multiple places, inside of the Adobe I/O CLI IMS Plugins or outside.
* Store as little information in the configuration data as possible. This boils down to the absolutely needed fields, such as `client_id`, `client_secret`, `private_key` etc. The boilerplate, such as the bulk of the JWT token should be provided dynamically.
* The plugins should support all three of the login mechanism: SUSI/UI based for user token, JWT based (technical/utility) user tokens, as well as Adobe-internal service tokens.

# The JavaScript Packages

Without much further ado, here is the collection of IMS supporting plugins:

* The [Adobe I/O Lib Core IMS Support Library](https://github.com/adobe/aio-lib-ims) is the reusable base library providing JavaScript level API to the IMS APIs as well as getting access to tokens. All the functionality of this library is available by simply requiring this library.
* This [Adobe I/O CLI IMS Plugin](https://github.com/adobe/aio-cli-plugin-ims) is the main CLI plugin to the Adobe IO CLI. See #plugin for more details below.
* Three extension to the _Adobe IO IMS Support Library_ supporting creation of IMS tokens for different use cases. They all come as node packages. They are used by the _Adobe IO IMS Support Library_ to implement the access token creation. The plugins are:
    * The [Adobe I/O Lib Core IMS Library JWT Support](https://github.com/adobe/aio-lib-ims-jwt) supporting the generation and exchange for an access token of JWT Tokens.
    * The [Adobe I/O Lib Core IMS Library OAuth2 Support](https://github.com/adobe/aio-lib-ims-oauth) supporting the creation of tokens using the normal browser-based SUSI flow. To that avail the SUSI flow part is implemented as an embedded [Electron app](https://electronjs.org) driving the browser based interaction and capturing the callback from IMS.

# How it works

This _Adobe IO CLI IMS Plugin_ offers four commands:

* [`login`](#aio-imslogin) to create and return IMS access tokens. Since tokens are cached in the Adobe IO CLI configuration, an actual token is only created if the currently cached token has already expired (or is about to expire within 10 minutes).
* [`logout`](#aio-imslogout) invalidate cached tokens and remove them from the cache. Besides the access token, this can also be used to invalidate any refresh token that may be cached.
* [`ctx`](#aio-imsctx) to manage configuration contexts.
* [`plugins`](#aio-imsplugins-plugin) to manage configuration contexts.
* [`profile`](#aio-imsprofile), [`organizations`](#aio-imsorganizations), and [`session`](#aio-imssession) to retrieve respective IMS information
* Low level [`get`](#aio-imsget-api) and [`post`](#aio-imspost-api) to directly call IMS API using raw HTTP `GET` and `POST` requests.

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
* [`aio ims:get API`](#aio-imsget-api)
* [`aio ims:organizations`](#aio-imsorganizations)
* [`aio ims:post API`](#aio-imspost-api)
* [`aio ims:profile`](#aio-imsprofile)
* [`aio ims:session`](#aio-imssession)

## `aio ims`

IMS commands to login and logout.

```
USAGE
  $ aio ims

DESCRIPTION
  IMS commands to login and logout.

  The "env" property is mandatory and designates the IMS environment
  used for authentication. Possible values are "stage" and "prod".
  If the property is missing or any other value, it defaults to "stage".

  All commands allow their normal output to be formatted in either
  HJSON (default), JSON, or YAML.


EXAMPLES
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

_See code: [src/commands/ims/index.js](https://github.com/adobe/aio-cli-plugin-ims/blob/v2.0.0/src/commands/ims/index.js)_

## `aio ims:get API`

Call an IMS API using a GET request

```
USAGE
  $ aio ims:get API [--debug <value>] [-v] [-l | -g] [-c <value>] [-d <value>...]

ARGUMENTS
  API  The IMS API to call, for example: /ims/profile/v1

FLAGS
  -c, --ctx=<value>      Name of the IMS context to use. Default is the current IMS context
  -d, --data=<value>...  Request parameter in the form of name=value. Repeat for multiple parameters
  -g, --global           global config
  -l, --local            local config
  -v, --verbose          Verbose output
      --debug=<value>    Debug level output

DESCRIPTION
  Call an IMS API using a GET request

  This is a raw and low level IMS API call command taking the IMS API
  path as the first argument and any additional request parameters
  as optional additional arguments.

  The API result is printed as an object if successful. If the call
  fails, the error message is returned as an error.
```

_See code: [src/commands/ims/get.js](https://github.com/adobe/aio-cli-plugin-ims/blob/v2.0.0/src/commands/ims/get.js)_

## `aio ims:organizations`

Retrieve the organizations to which the user is associated

```
USAGE
  $ aio ims:organizations [--debug <value>] [-v] [-l | -g] [-c <value>] [-d <value>...]

FLAGS
  -c, --ctx=<value>      Name of the IMS context to use. Default is the current IMS context
  -d, --data=<value>...  Request parameter in the form of name=value. Repeat for multiple parameters
  -g, --global           global config
  -l, --local            local config
  -v, --verbose          Verbose output
      --debug=<value>    Debug level output

DESCRIPTION
  Retrieve the organizations to which the user is associated

  This is a raw and low level IMS API call command taking the IMS API
  path as the first argument and any additional request parameters
  as optional additional arguments.

  The API result is printed as an object if successful. If the call
  fails, the error message is returned as an error.
```

_See code: [src/commands/ims/organizations.js](https://github.com/adobe/aio-cli-plugin-ims/blob/v2.0.0/src/commands/ims/organizations.js)_

## `aio ims:post API`

Call an IMS API using a POST request

```
USAGE
  $ aio ims:post API [--debug <value>] [-v] [-l | -g] [-c <value>] [-d <value>...]

ARGUMENTS
  API  The IMS API to call, for example: /ims/profile/v1

FLAGS
  -c, --ctx=<value>      Name of the IMS context to use. Default is the current IMS context
  -d, --data=<value>...  Request parameter in the form of name=value. Repeat for multiple parameters
  -g, --global           global config
  -l, --local            local config
  -v, --verbose          Verbose output
      --debug=<value>    Debug level output

DESCRIPTION
  Call an IMS API using a POST request

  This is a raw and low level IMS API call command taking the IMS API
  path as the first argument and any additional request parameters
  as optional additional arguments.

  The API result is printed as an object if successful. If the call
  fails, the error message is returned as an error.
```

_See code: [src/commands/ims/post.js](https://github.com/adobe/aio-cli-plugin-ims/blob/v2.0.0/src/commands/ims/post.js)_

## `aio ims:profile`

Retrieve the IMS Profile (for a user token)

```
USAGE
  $ aio ims:profile [--debug <value>] [-v] [-l | -g] [-c <value>] [-d <value>...]

FLAGS
  -c, --ctx=<value>      Name of the IMS context to use. Default is the current IMS context
  -d, --data=<value>...  Request parameter in the form of name=value. Repeat for multiple parameters
  -g, --global           global config
  -l, --local            local config
  -v, --verbose          Verbose output
      --debug=<value>    Debug level output

DESCRIPTION
  Retrieve the IMS Profile (for a user token)

  This is a raw and low level IMS API call command taking the IMS API
  path as the first argument and any additional request parameters
  as optional additional arguments.

  The API result is printed as an object if successful. If the call
  fails, the error message is returned as an error.
```

_See code: [src/commands/ims/profile.js](https://github.com/adobe/aio-cli-plugin-ims/blob/v2.0.0/src/commands/ims/profile.js)_

## `aio ims:session`

Retrieve the IMS Profile (for a user token)

```
USAGE
  $ aio ims:session [--debug <value>] [-v] [-l | -g] [-c <value>] [-d <value>...]

FLAGS
  -c, --ctx=<value>      Name of the IMS context to use. Default is the current IMS context
  -d, --data=<value>...  Request parameter in the form of name=value. Repeat for multiple parameters
  -g, --global           global config
  -l, --local            local config
  -v, --verbose          Verbose output
      --debug=<value>    Debug level output

DESCRIPTION
  Retrieve the IMS Profile (for a user token)

  This is a raw and low level IMS API call command taking the IMS API
  path as the first argument and any additional request parameters
  as optional additional arguments.

  The API result is printed as an object if successful. If the call
  fails, the error message is returned as an error.
```

_See code: [src/commands/ims/session.js](https://github.com/adobe/aio-cli-plugin-ims/blob/v2.0.0/src/commands/ims/session.js)_
<!-- commandsstop -->


# Contributing
Contributions are welcomed! Read the [Contributing Guide](CONTRIBUTING.md) for more information.


# Licensing

This project is licensed under the Apache V2 License. See [LICENSE](LICENSE) for more information.
