var common = require('gulp-common-build-tasks');
var node = require('gulp-node-build-tasks');

var tasks = common.tasks();

function hasServerEnabled(value) {
    return config => {
        return config.hasServer ? value : false;
    };
}

tasks.import(require('./app'));
tasks.import(hasServerEnabled(require('./node')));
tasks.karma = require('./karma');
tasks.protractor = require('./protractor');

tasks.addTransformConfigurationFunction(require('./config'));

tasks.create('build', ['app.build', hasServerEnabled('node.build')]);
tasks.create('clean', ['app.clean', hasServerEnabled('node.clean')]);
tasks.create('e2e', ['app.protractor']);
tasks.create('e2e:src', ['app.protractor:src']);
tasks.create('e2e:dist', ['app.protractor:dist']);
tasks.create('serve', ['app.serve', hasServerEnabled('node.serve')]);
tasks.create('serve:dist', ['app.serve:dist', hasServerEnabled('node.serve:dist')]);
tasks.create('serve:e2e', ['app.serve:e2e', hasServerEnabled('node.serve')]);
tasks.create('serve:e2e-dist', ['app.serve:e2e-dist', hasServerEnabled('node.serve:dist')]);
tasks.create('test', ['app.test', hasServerEnabled('node.test')]);
tasks.create('test:auto', ['app.test:auto', hasServerEnabled('node.watch')]);

module.exports = tasks;
