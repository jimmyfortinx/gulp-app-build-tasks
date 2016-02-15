var _ = require('lodash');

var common = require('gulp-common-build-tasks');

var tasks = common.tasks('app');

tasks.addTransformConfigurationFunction(function(config) {
    var configClone = _.cloneDeep(config);

    delete configClone.server;
    delete configClone.hasServer;

    return configClone;
});

tasks.import(require('./server'));
tasks.import(require('./unit-tests'));
tasks.import(require('./e2e-tests'));

module.exports = tasks;
