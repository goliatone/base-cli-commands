'use strict';
const extend = require('gextend');
const BaseCommand = require('./base');
/**
 * TODO: Rename file to core-command
 */
class CoreCommand extends BaseCommand {

    static runner(cli, cmd) {

        const Command = this;
        const context = cli.context;

        cmd.action((args, options, logger) => {
            let event = extend({}, args, options);

            const config = BaseCommand._getOptions(logger, cli);

            /**
             * We are building the event that will be sent
             * to our core.io command.
             */
            event = context.makeEventForCommand(cmd.name(), event);
            const command = new Command(config);

            const out = command
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