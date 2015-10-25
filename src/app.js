var glob = require('glob');
var path = require('path');
var EventEmitter2 = require('eventemitter2').EventEmitter2;

var MISSING_GLOB_PATTERN_ERROR = 'Must provide config.glob.pattern for module loading';
var NO_FILES_FOUND_ERROR = 'No files found to load';

/**
 * The App
 * @constructor
 * @param {object} config - A config object
 * @property {object} config.glob - The config to be passed to glob - 
 * see {@link https://github.com/isaacs/node-glob) node-glob }
 * @property {object} config.glob.pattern - The pattern to be passed to glob
 */
var App = function(config) {
	var app = this;
	app.config = config;
	app.modules = {};
	app.moduleFiles = [];
	app.eventEmitter = new EventEmitter2({wildcard: true});

	process.nextTick(app.init.bind(app));
	
	return app;
};

/**
 * Sets up the app
 * @fires app.init
 * @fires app.ready
 */
App.prototype.init = function() {
	var app = this;
	
	require('./modules/event-logger.js').eventLogger.init(app.eventEmitter);

	/**
	 * @event App.app:init
	 * @description
	 * The application instance has been constructed
	 */
	app.eventEmitter.emit('app.init', app);

	app.eventEmitter.on('app.modules.found', app.createModules.bind(app));
	app.eventEmitter.on('app.modules.created', app.initModules.bind(app));
	app.eventEmitter.on('app.modules.init', function() {
		/**
		 * @event App.app:ready
		 * @description
		 * App modules have been initialized and the application is ready for modules
		 * to begin augmenting the application
		 */
		app.eventEmitter.emit('app.ready', app);
	});

	if (app.config && app.config.glob) {
		app.findModules(app.config.glob);
	}
};

/**
 * Add a module to the app
 * @param {string} moduleName - The name of the module to add
 * @param {object} module - The module to add
 */
App.prototype.addModule = function(moduleName, module) {
	this.modules[moduleName] = module;
};

/**
 * Gets a module by name
 * @param {string} moduleName - The name of the module to get
 */
App.prototype.getModule = function(moduleName) {
	return this.modules[moduleName];
};

/**
 * Traverses using glob and attaches a moduleFiles to the app
 * @param {object} opt - Options to be passed to glob
 * @fires app.modules.found
 */
App.prototype.findModules = function(opt) {
	var app = this;

	if (!opt.pattern) { throw new Error(MISSING_GLOB_PATTERN_ERROR); }
	opt.pattern = path.join(process.cwd(), opt.pattern);

	glob(opt.pattern, opt, function(er, files) {
		if (er || !files) {
			throw new Error(er ? er : NO_FILES_FOUND_ERROR);
		}
		app.moduleFiles = files;
		/**
		 * @event App.app:modules:found
		 * @description
		 * App modules have been found on the fileystem
		 */
		app.eventEmitter.emit('app.modules.found', app);
	});
};

/**
 * Itterates through app.moduleFiles and requires each and adds them to the app
 * @fires app.modules.created
 */
App.prototype.createModules = function() {
	var app = this;
	app.moduleFiles.forEach(function(file){
		var loadedFile = require(file);
		
		//we assume each property exported is a module
		for (var prop in loadedFile) {
			if (loadedFile.hasOwnProperty(prop)){
				app.addModule(prop, loadedFile[prop]);
			}
		}
	});
	/**
	 * @event App.app:modules:created
	 * @description
	 * App modules have been required
	 */
	app.eventEmitter.emit('app.modules.created', app);
};

/**
 * Iterates through all modules and calls the init method on each passing the app's eventEmitter instance
 * @fires app.modules.init
 */
App.prototype.initModules = function() {
	var app = this;
	for (var module in app.modules) {
		if (app.modules.hasOwnProperty(module)) {
			if (app.modules[module] && typeof app.modules[module].init === 'function') {
				app.modules[module].init(app.eventEmitter);
			}
		}
	}
	/**
	 * @event App.app:modules:init
	 * @description
	 * App modules have all been initialized and passed an eventEmitter
	 */
	app.eventEmitter.emit('app.modules.init', app);
};

module.exports = App;