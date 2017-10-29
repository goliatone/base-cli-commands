'use strict';

const fs = require('fs');
const Bluebird = require('bluebird');

const mkdirp = Bluebird.promisify(require('mkdirp'));
const readFile = Bluebird.promisify(fs.readFile);
const writeFile = Bluebird.promisify(fs.writeFile);
const unlink = Bluebird.promisify(fs.unlink);
const stat = Bluebird.promisify(fs.stat);
const existsSync = fs.existsSync;

function exists(pathname) {
    return stat(pathname).then(() => true).catch(err => {
        if(err.code !== 'ENOENT') {
            throw err;
        }

        return false;
    });
}

const fsu = {
    mkdirp,
    readFile,
    writeFile,
    unlink,
    stat,
    exists,
    existsSync
};

module.exports = fsu;
