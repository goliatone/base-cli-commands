'use strict';
const fs = require('fs');
const path = require('path');
const extend = require('gextend');

const DEFAULTS = {
    projectMeta: '.core.iorc'
};

class Paths {
    constructor(options = {}) {
        options = extend({}, DEFAULTS, { base: this.getBasePath() }, options);

        this._base = options.base;
        this._package = path.join(this._base, 'package.json');
        this._projectMeta = path.join(this._base, options.projectMeta);
        this._homedir = require('os').homedir();
    }

    base(...args) {
        return this._join(this._base, ...args);
    }

    homedir(...args) {
        return this._join(this._homedir, ...args);
    }

    get package() {
        return this._package;
    }

    get projectMeta() {
        return this._projectMeta;
    }

    getBasepath() {
        return this.getBasePath();
    }

    getBasePath() {
        if (process.env.NODE_APP_BASE) {
            return process.env.NODE_APP_BASE;
        }

        const test = /\/pm2|mocha|ava|forever\//i;
        let parent = module;

        while (parent.parent && !test.test(parent.parent.filename)) {
            parent = parent.parent;
        }

        let dirname = path.dirname(parent.filename);

        while (dirname !== '/' && dirname !== '.' && !_hasPackage(dirname)) {
            dirname = path.dirname(dirname);
        }

        if (dirname === '/' || dirname === '.') {
            throw new Error('Could not find base path.');
        }

        return dirname;
    }

    _join(root, ...args) {
        if (!args.length) return root;
        args.unshift(root);
        return path.join(...args);
    }
}

function _hasPackage(dirname) {
    return fs.existsSync(path.join(dirname, 'package.json'));
}

module.exports = Paths;
