var EventEmitter2 = require('eventemitter2').EventEmitter2;

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
	
	//load the logger
	require('./modules/event-logger.js').eventLogger.init(app.eventEmitter);
	//load the glob module loader
	require('./modules/glob-module-loader.js').globModuleLoader.init(app.eventEmitter);

	/**
	 * @event App.app:init
	 * @description
	 * The application instance has been constructed
	 */
	app.eventEmitter.emit('app.init', app);
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
 * Gets a module by name
 * @param {string} moduleName - The name of the module to initialize (call the init method on)
 */
App.prototype.initializeModule = function(moduleName) {
	var app = this;
	if (app.modules.hasOwnProperty(moduleName)) {
		var module = app.getModule(moduleName);
		if (module && typeof module.init === 'function') {
			module.init(app.eventEmitter);
			/**
			 * @event App.app:module:NAME:init
			 * @description
			 * A module has been initialized
			 */
			app.eventEmitter.emit('app.modules.'+moduleName+'.init', app);
		}
	}
};

module.exports = App;