const Say = require('./say');
const Echo = require('./echo');

/**
 * Attach commands to given application context,
 * if a `namespace` is given then commands will
 * be added as sub-commands.
 */
module.exports.attach = function $attach(app, namespace = false) {

    const context = {
        namespace,
        prog: app.prog
    };

    Say.attach(context);
    Echo.attach(context);
};
