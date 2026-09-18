/*
Copyright 2019 Adobe Inc. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

const { Command, Help } = require('@oclif/core')

class IndexCommand extends Command {
  async run () {
    const help = new Help(this.config || {})
    help.showHelp(['ims', '--help'])
  }
}

IndexCommand.description = `IMS commands to login and logout.

The "env" property is mandatory and designates the IMS environment
used for authentication. Possible values are "stage" and "prod".
If the property is missing or any other value, it defaults to "stage".

All commands allow their normal output to be formatted in either
HJSON (default), JSON, or YAML.
`

IndexCommand.examples = [
  `{
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
  `
]
module.exports = IndexCommand
