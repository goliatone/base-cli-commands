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
    },
    paths: {
        templates(filename) {
            return filename;
        }
    }
};

class TemplateRenderer {

    constructor(options = {}) {
        this.logger = options.logger || console;
        this.paths = options.paths || defaults.paths;
        this.template = options.template || defaults.template;
        this.transformer = buildTransformer(defaults.template.engine);
    }

    render(file, data = {}) {
        const filepath = this.templatePath(file);
        const options = defaults.template.options;

        return this.getFileContents(filepath)
            .then(content => {
                const output = this.transformer.render(content, options, data);
                return output.body;
            });
    }

    /**
     * Load a files content as a string.
     * @param {String} filepath
     * @returns {String} File content
     */
    getFileContents(filepath) {
        return fsu.readFile(filepath)
            .then(content => content.toString());
    }

    /**
     * Get a template file's path from the
     * template id.
     * @param {String} templateId Template ID
     * @returns {String}
     */
    templatePath(templateId) {
        const filename = this.template.filename(templateId);
        return this.paths.templates(filename);
    }
}

module.exports = TemplateRenderer;
