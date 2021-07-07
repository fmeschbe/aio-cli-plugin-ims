/*
Copyright 2018 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

const ImsBaseCommand = require('@adobe/aio-cli-plugin-auth/src/ims-base-command')

class ClientIdCommand extends ImsBaseCommand {
  async run () {
    const { flags } = this.parse(ClientIdCommand)

    const { getTokenData, getToken, CLIENT_ID, context } = require('@adobe/aio-lib-ims')
    try {
      await getToken(flags.ctx)
        .then(token => getTokenData(token)[CLIENT_ID])
        .then(clientId => this.log(clientId))
    } catch (err) {
      const stackTrace = err.stack ? '\n' + err.stack : ''
      this.debug(`Login Failure: ${err.message || err}${stackTrace}`)
      this.error(`Cannot get token for context '${flags.ctx || context.current}': ${err.message || err}`, { exit: 1 })
    }
  }
}

ClientIdCommand.description = `Log in with a certain IMS context and returns the client ID.

The client ID is the value of 'client_id' property of the IMS token payload
and can also be used as the API key, the x-api-key request header, for API
calls using the token.

See 'aio ims:login --help' for details on how to acquire an access token
`

ClientIdCommand.flags = {
  ...ImsBaseCommand.flags
}

ClientIdCommand.args = [
  ...ImsBaseCommand.args
]

module.exports = ClientIdCommand
