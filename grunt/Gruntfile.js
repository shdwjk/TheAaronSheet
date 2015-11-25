/*global module:false*/
module.exports = function(grunt) {
    "use strict";

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    meta: {
      version: '0.1.0'
    },
    banner: '/*! PROJECT_NAME - v<%= meta.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '* http://PROJECT_WEBSITE/\n' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> ' +
      'YOUR_NAME; Licensed MIT */\n',
    // Task configuration.
    template: {
        examples: {
            options: {
                procces: {data: {theAaronSheet: grunt.file.read('../TheAaronSheet.js')}}
            },
            files: {
                'example_src/example1_repeatingSimpleSum.template': ['../examples/example1_repeatingSimpleSum.html'],
                'example_src/example2_repeating_object.template': ['../examples/example2_repeating_object.html']
            }
        }
    }
//    uglify: {
//      options: {
//        banner: '<%= banner %>'
//      },
//      dist: {
//        src: '<%= concat.dist.dest %>',
//        dest: 'dist/FILE_NAME.min.js'
//      }
//    },
//    jshint: {
//      options: {
//        curly: true,
//        eqeqeq: true,
//        immed: true,
//        latedef: true,
//        newcap: true,
//        noarg: true,
//        sub: true,
//        undef: true,
//        unused: true,
//        boss: true,
//        eqnull: true,
//        globals: {}
//      },
//      gruntfile: {
//        src: 'Gruntfile.js'
//      },
//      lib_test: {
//        src: ['lib/**/*.js', 'test/**/*.js']
//      }
//    },
//    nodeunit: {
//      files: ['test/**/*_test.js']
//    },
//    watch: {
//      gruntfile: {
//        files: '<%= jshint.gruntfile.src %>',
//        tasks: ['jshint:gruntfile']
//      },
//   }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-template');

  // Default task.
  grunt.registerTask('default', [
//      'jshint',
//      'nodeunit',
//      'concat',
//      'uglify',
      'template'
  ]);

};
