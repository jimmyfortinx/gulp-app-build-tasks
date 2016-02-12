var _ = require('lodash');

var common = require('gulp-common-build-tasks');
var node = require('gulp-node-build-tasks');

var tasks = common.tasks();

node._tasks = [];
tasks.import(node);

tasks.addTransformConfigurationFunction(function(config) {
    if (config.hasServer) {
        return _.cloneDeep(config.server);
    }

    return {};
});

module.exports = tasks;
