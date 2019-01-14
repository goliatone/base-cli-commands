#!/usr/bin/env node

'use strict';
const extend = require('gextend');
const updateNotifier = require('update-notifier');

const DEFAULTS = {
    logger: console,
    prog: require('caporal'),
    updateNotifier: require('update-notifier')
};

/**
 * Base CLI application. 
 * It will register all subcommands and parse
 * the terminal arguments, then call the command
 * action.
 * 
 * Default implementation to handle comamands
 * is done using [caporal](https://www.npmjs.com/package/caporal)
 */
class Cli {
    constructor(options) {
        options = extend({}, DEFAULTS, options);
        this.init(options);
    }

    init(options = {}) {
        extend(this, options);

        if (!this.package) {
            throw new Error('Missing required package');
        }

        this.setupUpdateNotifier(options);
        this.setupProgram(options);
    }

    /**
     * Setup update notifier.
     * @see https://www.npmjs.com/package/update-notifier
     * @param {Object} options 
     */
    setupUpdateNotifier(options) {
        if (!options.checkForUpdates) {
            return;
        }

        if (!this.package) {
            throw new Error('Missing required package');
        }

        this.updateNotifier({
            pkg: this.package
        }).notify();
    }

    /**
     * Setup the CLI program metadata.
     * 
     * @param {Object} options Options
     */
    setupProgram(options) {
        if (!this.package) {
            throw new Error('Missing required package');
        }

        const pkg = this.package;

        this.prog.version(pkg.version).description(pkg.description);
    }

    /**
     * Make the commands available for this
     * program.
     * 
     * Usually command is an entry point file
     * that will then attach individual commands.
     * 
     * ```js
     * const ServicePingCommand = require('../commands/service.ping');
     * const ServiceLatencyCommand = require('../commands/service.id.latency');
     * 
     * module.exports.attach = function(cli, namespace=false) {
     *   const config = {
     *      namespace,
     *      prog: cli.prog,
     *      context: cli.context
     *   };
     * 
     *   ServicePingCommand.attach(config);
     *   ServiceLatencyCommand.attach(config);
     * };
     *
     * @param {Array} commands List of commands to attach
     */
    attachCommands(commands = this.commands) {
        commands.attach(this);
    }

    /**
     * Entry point for our CLI application.
     * 
     * This will attach the configured commands
     * and parse the arguments, then call the
     * given command.
     * 
     * 
     * @param {Array} argv process.argv
     */
    run(argv) {
        this.attachCommands();

        this.prog.parse(argv);
    }
}

module.exports = Cli;