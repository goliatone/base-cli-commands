'use strict';

const test = require('tape');
const { join } = require('path');

const TemplateRenderer = require('..').TemplateRenderer;

test('package should export TemplateRenderer', t => {
    t.ok(TemplateRenderer);
    t.end();
});


test('TemplateRenderer should render template', async t => {
    let template = new TemplateRenderer({
        paths: {
            templates(filename) {
                return join(__dirname, 'fixtures', filename);
            }
        }
    });

    let expected = 'value';

    let result = await template.render('template', { test: 'value' });
    t.ok(result);
    t.deepEquals(result, expected, 'Rendered value');
    t.end();
});

test('TemplateRenderer should load template content', async t => {
    let template = new TemplateRenderer({
        paths: {
            templates(filename) {
                return join(__dirname, 'fixtures', filename);
            }
        }
    });

    let expected = '{{test}}';
    let filename = template.template.filename('template');
    let filepath = template.paths.templates(filename);
    let result = await template.getFileContents(filepath);
    t.ok(result);
    t.deepEquals(result, expected, 'Rendered value');
    t.end();
});
