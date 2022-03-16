'use strict';

const test = require('tape');
const { join } = require('path');
const { BasePaths } = require('..');

test('package should export BasePaths', t => {
    t.ok(BasePaths);
    t.end();
});


test('BasePaths take app base from env', t => {

    let expected = 'my-env-base-path';

    process.env.NODE_APP_BASE = expected;

    let paths = new BasePaths();
    let result = paths.getBasePath();

    t.ok(result);
    t.deepEquals(result, expected, 'Returns expected base path');

    process.env.NODE_APP_BASE = '';

    t.end();
});

test('BasePaths take config "base" attribute', t => {

    let expected = 'my-base-path';
    let paths = new BasePaths({ base: expected });
    let result = paths.base();
    t.ok(result);
    t.deepEquals(result, expected, 'Returns expected base path');
    t.end();
});

test('BasePaths will give you a path to a file relative to base', t => {

    let expected = join(__dirname, 'index.js');
    let paths = new BasePaths({ base: __dirname });
    let result = paths.base('index.js');
    t.ok(result);
    t.deepEquals(result, expected, 'Returns expected base path');
    t.end();
});

test('BasePaths will give you a path to the package', t => {

    let expected = join(__dirname, 'package.json');
    let paths = new BasePaths({ base: __dirname });
    let result = paths.package;
    t.ok(result);
    t.deepEquals(result, expected, 'Returns expected base path');
    t.end();
});
