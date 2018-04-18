'use strict';
const extend = require('gextend');
const BaseCommand = require('./base');

class CoreCommand extends BaseCommand {

    static runner(cli, cmd) {
        
        const Command = this;
        const context = cli.context;

        cmd.action((args, options, logger) => {
            let event = extend({}, args, options);

            let config = BaseCommand._getOptions(logger, cli);

            event = context.makeEventForCommand(cmd.name(), event);
            const command = new Command(config);

            let out = command
                .ready()
                .execute(event);

            Promise.resolve(out).then(cli => {
                process.exit(0);
            })
            .catch(logger.error);
        });
    }
}

module.exports = CoreCommand;