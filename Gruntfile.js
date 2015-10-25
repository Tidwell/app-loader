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
		jsdoc: {
			dist: {
				src: ['src/**/*.js', 'test/**/*.js', 'README.md'],
				options: {
					destination: 'docs/build',
					template: 'node_modules/ink-docstrap/template',
					configure: 'docs/jsdoc.conf.json'
				}
			}
		},
		open: {
			docs: {
				path: 'http://localhost:8888',
				app: 'Google Chrome'
			}
		},
		jasmine_nodejs: {
			// task specific (default) options
			options: {
				specNameSuffix: "spec.js", // also accepts an array
				helperNameSuffix: "helper.js",
				useHelpers: false,
				stopOnFailure: false,
				// configure one or more built-in reporters
				reporters: {
					console: {
						colors: true,
						cleanStack: 1, // (0|false)|(1|true)|2|3
						verbosity: 4, // (0|false)|1|2|3|(4|true)
						listStyle: "indent", // "flat"|"indent"
						activity: false
					}
				},
			},
			app: {
				// target specific options
				options: {
				},
				// spec files
				specs: [
					"tests/**",
				]
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-jsdoc');
	grunt.loadNpmTasks('grunt-open');
	grunt.loadNpmTasks('grunt-jasmine-nodejs');


	grunt.registerTask('default', ['jshint']);

	grunt.registerTask('docs', ['jsdoc:dist', 'connect', 'open', 'watch:docs']);

	grunt.registerTask('test', ['jasmine_nodejs:app']);
};