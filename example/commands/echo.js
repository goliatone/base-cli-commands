'use strict';

const extend = require('gextend');
const BaseCommand = require('../..').BaseCommand;


class EchoCommand extends BaseCommand {

    execute(event) {
        event = extend({}, EchoCommand.DEFAULTS, event);

        let o = event.options;

        let addDate = o.addDate;
        let std = event.std;
        let content = event.content;
        this.logger.info('echo:', content);
        return true
    }

    static describe(prog, cmd) {
        cmd.argument('<content>',
            'Content to be echoed',
            /.*/
        );

        cmd.argument('[std]', 'Output to [std].', /.*/);

        cmd.option('--add-date',
            'Add date to output.',
            prog.BOOL,
            EchoCommand.DEFAULTS.options.addDate
        );
    }
}

EchoCommand.DEFAULTS = {
    options: {
        addDate: false
    }
};

EchoCommand.COMMAND_NAME = 'echo';
EchoCommand.DESCRIPTION = 'Test our CLI application by echoing our input';

module.exports = EchoCommand;
