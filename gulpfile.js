var gulp = require('gulp');
var gulpNodeBuildTasks = require('gulp-node-build-tasks');

var config = {
    projectDirectory: __dirname,
    paths: {
        src: "tasks"
    }
};

gulpNodeBuildTasks.apply(config, gulp);