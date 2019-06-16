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
const ImsBaseCommand = require('../../ims-base-command')

class CtxCommand extends ImsBaseCommand {
  async run() {
    const { args, flags } = this.parse(CtxCommand);

    /**
     * What do I want to do ?
     * + list the context names
     * + read the current context label
     * + set the current context label
     * + show context data (current or named)
     * - set the current context data ???
     */

    if (flags.list) {
      this.printObject(this.contexts);
    } else if (flags.val) {
      this.printObject(this.getContext(args.ctx));
    } else if (flags.set) {
      this.printObject(this.currentContext = args.ctx);
    } else {
      this.printObject(this.currentContext);
    }

  }
}

CtxCommand.description = `Manage IMS contexts.

The following options exist for this command:

* List the names of the configured IMS contexts
* Print the name of the current IMS context
* Set the name of the current IMS context
* Print the configuration of the current or a named IMS context

Currently it is not possible to update the IMS context configuration
using this command. Use the "aio config" commands for this.

Please note, that the IMS context label "$current" is reserved and
must not be used as an IMS context name.
`

CtxCommand.flags = {
  ...ImsBaseCommand.flags,
  list: flags.boolean({ description: 'Names of the IMS contexts as an array', exclusive: ['val','set'], multiple:false }),
  set: flags.boolean({ char: 's', description: 'Sets the name of the current IMS context', exclusive: ['list','val'], multiple:false })
  val: flags.boolean({ description: 'Prints named or current IMS context data', exclusive: ['list','set'], multiple:false }),
}

CtxCommand.args = [
  ...ImsBaseCommand.args
]

module.exports = CtxCommand
