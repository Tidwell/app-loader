module.exports = function(grunt) {

  grunt.initConfig({
    jshint: {
      files: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js'],
      options: {
        globals: {
          
        }
      }
    },
    connect: {
      server: {
        options: {
          port: 8888,
          base: 'docs/build',
          livereload: true
        },
      }
    },
    watch: {
      docs: {
        files: ['<%= jshint.files %>', 'README.md'],
        tasks: ['jsdoc:dist']
      }
    },
     jsdoc : {
        dist : {
            src: ['src/**/*.js', 'test/**/*.js', 'README.md'],
            options: {
                destination: 'docs/build',
                template: 'node_modules/ink-docstrap/template',
                configure: 'docs/jsdoc.conf.json'
            }
        }
    },
    open : {
      docs : {
        path: 'http://localhost:8888',
        app: 'Google Chrome'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-jsdoc');
  grunt.loadNpmTasks('grunt-open');

  grunt.registerTask('default', ['jshint']);

  grunt.registerTask('docs', ['jsdoc:dist', 'connect', 'open', 'watch:docs'])

  grunt.registerTask('test', function() {
    console.log('no tests derp');
  });
};