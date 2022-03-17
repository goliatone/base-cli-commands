'use strict';

const test = require('tape');
const { CliApp } = require('..');

test('package should export CliApp', t => {
    t.ok(CliApp);
    t.end();
});

test('CliApp should call our cli handler', async t => {
    const expected = ['help'];

    const app = new CliApp({
        commands: {
            attach(cli) {
                t.deepEqual(cli, app, 'Attach gets cli instance');
            }
        },
        prog: {
            parse(argv) {
                t.deepEqual(argv, expected);
                t.end();
            },
            configure() {}
        },
        package: require('../package.json')
    });

    t.ok(app);

    await app.run(expected);
});
