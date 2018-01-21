#!/usr/bin/env node

'use strict';
const extend = require('gextend');
const updateNotifier = require('update-notifier');

const DEFAULTS = {
    logger: console,
    prog: require('caporal'),
    updateNotifier: require('update-notifier')
};

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
     * Usually command is an entry point file
     * that will then attach individual commands.
     *
     * @param {Array} commands List of commands to attach
     */
    attachCommands(commands = this.commands) {
        commands.attach(this);
    }

    run(argv) {
        this.attachCommands();

        this.prog.parse(argv);
    }
}

module.exports = Cli;
