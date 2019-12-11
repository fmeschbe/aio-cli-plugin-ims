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

const { Command, flags } = require('@oclif/command')
const hjson = require('hjson')
const yaml = require('js-yaml')
const debug = require('debug')

class ImsBaseCommand extends Command {
  async init () {
    const { flags } = this.parse(this.constructor)

    // See https://www.npmjs.com/package/debug for usage in commands
    if (flags.verbose) {
      // verbose just sets the debug filter to everything (*)
      debug.enable('*')
    } else if (flags.debug) {
      debug.enable(flags.debug)
    }

    // ensure initializing the base class !
    return super.init()
  }

  printObject (obj) {
    const { flags } = this.parse(this.constructor)

    let format = 'hjson'
    if (flags.yaml) format = 'yaml'
    else if (flags.json) format = 'json'

    const print = (obj) => {
      if (format === 'json') {
        this.log(JSON.stringify(obj))
      } else if (format === 'yaml') {
        this.log(yaml.safeDump(obj, { sortKeys: true, lineWidth: 1024, noCompatMode: true }))
      } else {
        if (typeof obj !== 'object') {
          this.log(obj)
        } else if (Object.keys(obj).length !== 0) {
          this.log(hjson.stringify(obj, {
            condense: true,
            emitRootBraces: true,
            separator: true,
            bracesSameLine: true,
            multiline: 'off',
            colors: false
          }))
        }
      }
    }

    if (obj != null) {
      print(obj)
    }
  }
}

ImsBaseCommand.flags = {
  debug: flags.string({ description: 'Debug level output' }),
  verbose: flags.boolean({ char: 'v', description: 'Verbose output' }),
  local: flags.boolean({ char: 'l', description: 'local config', exclusive: ['global'] }),
  global: flags.boolean({ char: 'g', description: 'global config', exclusive: ['local'] }),
  json: flags.boolean({ char: 'j', hidden: true, exclusive: ['yaml'] }),
  yaml: flags.boolean({ char: 'y', hidden: true, exclusive: ['json'] }),
  ctx: flags.string({ char: 'c', description: ' Name of the IMS context to use. Default is the current IMS context', multiple: false })
}

ImsBaseCommand.args = [
]

module.exports = ImsBaseCommand
