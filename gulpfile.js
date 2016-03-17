const gulp = require('gulp');
const initGulpTasks = require('react-component-gulp-tasks');

const taskConfig = {
  component: {
    name: 'Baduk',
    dependencies: [
      'react',
      'react/addons',
    ],
    lib: 'lib',
    less: {
      entry: 'baduk.less',
      path: 'less',
    },
  },

  example: {
    src: 'example/src',
    dist: 'example/dist',
    files: [
      'index.html',
      '.gitignore',
    ],
    scripts: [
      'example.js',
    ],
    less: [
      'example.less',
    ],
  },
};

initGulpTasks(gulp, taskConfig);
