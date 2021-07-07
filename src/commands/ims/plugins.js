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

const { flags } = require('@oclif/command')
const ImsBaseCommand = require('@adobe/aio-cli-plugin-auth/src/ims-base-command')

class PluginsCommand extends ImsBaseCommand {
  async run () {
    const { argv, flags } = this.parse(PluginsCommand)
    const { context } = require('@adobe/aio-lib-ims')

    if ((argv && argv.length > 0) || flags.force) {
      await context.setPlugins(argv)
    } else {
      await context.getPlugins()
        .then(plugins => {
          if (plugins instanceof Array) {
            if (flags.module) {
              return plugins.map(pluginLocation => {
                try {
                  const moduleFile = require.resolve(pluginLocation, { paths: require.main.paths })
                  return { plugin: pluginLocation, moduleFile }
                } catch (error) {
                  return { plugin: pluginLocation, error: `Failed to resolve: ${JSON.stringify(error.code)}` }
                }
              })
            } else {
              return plugins
            }
          } else {
            return Promise.reject(new Error(`Configured plugins '${JSON.stringify(plugins)}' must be an array but is a ${typeof plugins}`))
          }
        })
        .then(plugins => this.printObject(plugins))
        .catch(error => this.error(error))
    }

    const debugCore = require('debug')
    const debug = debugCore('mine')
    debug('debugCore.names: %o', debugCore.names)
    debug('debugCore.instances: %o', debugCore.instances)
  }
}

PluginsCommand.description = `Manage Create Token Plugins.

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
`

PluginsCommand.flags = {
  ...ImsBaseCommand.flags,

  force: flags.boolean({ char: 'f', description: 'Force configuring the list of plugins without checking for existence or contract' }),
  module: flags.boolean({ char: 'm', description: 'Show the module file loaded for each plugin' })
}

// just collect all arguments not being flags into the argv array and
// assume them to be plugins -- have the 'plugin' entry just for --help
// purposes.
PluginsCommand.strict = false
PluginsCommand.args = [
  { name: 'plugin', required: false, description: 'List of plugins to configure. If not provided, prints the current list instead' }
]

module.exports = PluginsCommand
