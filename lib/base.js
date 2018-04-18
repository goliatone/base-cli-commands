'use strict';
const extend = require('gextend');
const Paths = require('./paths');
const fsu = require('./fs-utils');

const ChildProcess = require('child-process-promise');

class BaseCommand {
    constructor(options = {}) {
        
        extend(this, BaseCommand.DEFAULTS, 
            this.constructor.DEFAULTS,
            options);
    }

    execute(event) {
        return this.doExecute(event);
    }

    doExecute(event) {
        return new Promise((resolve, reject) => {
            reject('Not implemented');
        });
    }

    ready() {
        if (this.useSudo) {
            if (process.env.USER !== 'root') {
                this.error('This command must run via sudo.');
            } else if (
                !process.env.SUDO_USER ||
                process.env.USER === process.env.SUDO_USER
            ) {
                this.error('This command must run via sudo, not as root.');
            }
        } else if (process.env.USER === 'root') {
            this.error('This command cant be run as root.');
        }

        return this;
    }

    commandExists(command) {
        return ChildProcess.exec(`/usr/bin/which ${command}`)
            .then(() => true)
            .catch(() => false);
    }

    exec(command, options) {
        if (this.dryRun) {
            return this.logger.info(command, options);
        }
        return ChildProcess.exec(command, options);
    }

    execAsUser(command, options) {
        if (process.env.USER !== 'root') {
            return this.exec(command, options);
        }

        return this.exec(
            `sudo -u "${process.env.SUDO_USER}" ${command}`,
            options
        );
    }

    error(msg, code = 1) {
        this.logger.error(msg);
        process.exit(code);
    }

    get useSudo() {
        return !!this._sudo;
    }

    set useSudo(v) {
        this._sudo = v;
    }

    get dryRun() {
        return !!this._dryRun;
    }

    set dryRun(v) {
        this._dryRun = v;
    }

    /**
     * This is the 
     * @param {Object} context Context for command
     */
    static attach(context) {
        const { prog, namespace } = context;

        const name = (namespace ? namespace + ' ' : '') + this.COMMAND_NAME;

        const cmd = prog.command(name, this.DESCRIPTION);

        this.describe(prog, cmd);

        this.runner(context, cmd);
    }

    /**
     * Instances extending BaseCommand should
     * implement this method. 
     * Declare options and flags.
     * 
     * ```
     * cmd.argument(
     *     '[plugin]',
     *     'Plugin to install',
     *     InstallCommand.DEFAULTS.plugin
     * );
     * ```
     * @param {caporal.Program} prog 
     * @param {caporal.Command} cmd Command 
     */
    static describe(prog, cmd) {}

    static runner(context, cmd) {
        const Command = this;

        cmd.action((args, options, logger) => {
            
            let config = _getOptions(logger, context);

            const command = new Command(config);

            args.options = options;

            let out = command
                .ready()
                .execute(args);

            Promise.resolve(out).then((context) => {
                process.exit(0);
            })
            .catch(logger.error);
        });
    }
}

BaseCommand.DEFAULTS = {
    paths: new Paths(),
    logger: console
};

BaseCommand._getOptions = _getOptions;

module.exports = BaseCommand;

function _getOptions(logger, context) {
    let config = {
        logger: logger
    };

    if(context.paths) {
        config.paths = context.paths;
    }

    return config;
}