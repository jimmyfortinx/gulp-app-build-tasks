var gulp = require('gulp');
var gulpNodeBuildTasks = require('gulp-node-build-tasks');

var config = {
    paths: {
        src: "tasks"
    }
};

gulpNodeBuildTasks.use(gulp);
gulpNodeBuildTasks.configure(config);
gulpNodeBuildTasks.registerTasks();