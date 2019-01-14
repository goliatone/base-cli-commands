'use strict';

const fsu = require('./fs-utils');
const buildTransformer = require('jstransformer');

const defaults = {
    template: {
        engine: require('jstransformer-swig'),
        options: {
            /*
             * https://node-swig.github.io/swig-templates/docs/api/#SwigOpts
             */
            varControls: ['{{', '}}'],
            filters: {}
        },
        filename: function(file) {
            return `${file}.swig`;
        }
    }
};

class TemplateRenderer {

    constructor(options) {
        this.logger = options.logger || console;
        this.paths = options.paths;
        this.transformer = buildTransformer(defaults.template.engine);
    }

    render(file, data) {
        const filename = defaults.template.filename(file);
        const filepath = this.paths.templates(filename);
        const options = defaults.template.options;
        return this.getFileContents(filepath)
            .then(content => {
                const output = this.transformer.render(content, options, data);
                return output.body;
            });
    }

    getFileContents(file) {
        return fsu.readFile(file)
            .then(content => content.toString());
    }
}

module.exports = TemplateRenderer;