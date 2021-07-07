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

const ImsCommandCommand = require('../../ims-command-command')

class AccountClusterCommand extends ImsCommandCommand {
  async getApi () {
    this.debug('get::api()')
    return '/ims/account_cluster/v2'
  }

  async call (ims, method, api, token, parameterMap) {
    this.debug('call(%s, %s, %s, %o)', method, api, token, parameterMap)

    // extract Client ID from token and set as client_id parameter
    const { getTokenData, CLIENT_ID } = require('@adobe/aio-lib-ims')
    parameterMap.client_id = getTokenData(token)[CLIENT_ID]

    return super.call(ims, method, api, token, parameterMap)
  }
}

AccountClusterCommand.description = `Retrieve the user's account cluster
The token must have the "account_cluster.read" scope for this API to
be successful.
${ImsCommandCommand.description}
`

AccountClusterCommand.flags = {
  ...ImsCommandCommand.flags
}

AccountClusterCommand.args = [
  ...ImsCommandCommand.args
]

module.exports = AccountClusterCommand
