module.exports = function (grunt) {
  "use strict";

  grunt.initConfig({

    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: {
        src: ['lib/**/*.js', 'routes/**/*.js', 'Gruntfile.js'],
      }
    },

    jsbeautifier: {
      'all': {
        src: ['lib/**/*.js', 'routes/**/*.js', 'Gruntfile.js'],
        options: {
          config: '.jsbeautifyrc'
        }
      }
    },

  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks("grunt-jsbeautifier");

  grunt.registerTask('check', [
    'jsbeautifier',
    'jshint',
  ]);

};
