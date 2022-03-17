'use strict';

const extend = require('gextend');
const BaseCommand = require('../..').BaseCommand;


class SayCommand extends BaseCommand {

    execute(event) {
        event = extend({}, SayCommand.DEFAULTS, event);

        let o = event.options;
        let name = event.name;

        this.logger.info(`Hello ${name}! This is a boring message...`);

        return true;
    }

    static describe(prog, cmd) {
        cmd.argument('[name]',
            'Say something to [NAME]', {
                validator: /.*/
            }
        );
    }
}

SayCommand.DEFAULTS = {
    options: {
        addDate: false
    }
};

SayCommand.COMMAND_NAME = 'say';
SayCommand.DESCRIPTION = 'Say something to [NAME]';

module.exports = SayCommand;
