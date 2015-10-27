/**
 * @module globModuleLoader
 * @description
 * Adds ability to load an entire directory of files by glob pattern
*/

var glob = require('glob');
var path = require('path');

var MISSING_GLOB_PATTERN_ERROR = 'Must provide config.glob.pattern for module loading';
var NO_FILES_FOUND_ERROR = 'No files found to load';

/**
 * @function init
 * @public
 * @description
 * initializes the glob loader
 *
 * Fires #bindLoading on app.init
 * @listens app.init
 * @param {eventEmitter} eventEmitter The App eventEmitter
*/
function init(eventEmitter) {
	eventEmitter.on('app.init', bindLoading);
}

function bindLoading(app) {
	//if they dont want to use the glob loader, the app is ready
	if (!app.config || !app.config.glob) {
		/**
		 * @event App.app:ready
		 * @description
		 * App modules have been initialized and the application is ready
		 */
		app.eventEmitter.emit('app.ready', app);
		return;
	}
	//otherwise load everything then fire the ready event
	load(app, app.config.glob, function() {
		app.eventEmitter.emit('app.ready', app);
	});
}

/**
 * Loads a glob-path of files as modules
 * @param {App} app - The application to add the module to
 * @param {object} globOptions - Options to be passed to glob
 * @param {function} cb - Callback
 * @fires app.modules.found
 */
function load(app, globOptions, cb) {
	findModules(app, globOptions, function(files) {
		createModules(app, files, function() {
			cb();
		});
	});
}

/**
 * Traverses using glob and attaches a moduleFiles to the app
 * @param {object} opt - Options to be passed to glob
 * @fires app.modules.found
 */
function findModules(app, opt, cb) {
	if (!opt.pattern) { throw new Error(MISSING_GLOB_PATTERN_ERROR); }
	opt.pattern = path.join(process.cwd(), opt.pattern);

	glob(opt.pattern, opt, function(er, files) {
		if (er || !files) {
			throw new Error(er ? er : NO_FILES_FOUND_ERROR);
		}
		cb(files);
	});
}

/**
 * Itterates through app.moduleFiles and requires each and adds them to the app
 * @fires app.modules.created
 */
function createModules(app, files, cb) {
	files.forEach(function(file){
		var loadedFile = require(file);
		
		//we assume each property exported is a module
		for (var prop in loadedFile) {
			if (loadedFile.hasOwnProperty(prop)){
				app.addModule(prop, loadedFile[prop]);
				app.initializeModule(prop);
			}
		}
	});
	cb();
}


module.exports = {
	globModuleLoader: {
		init: init,
		load: load
	}
};