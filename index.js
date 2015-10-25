//get the App constructor
var App = require('./src/app.js');

function createApp(config, callback) {
	var app = new App(config);
	return app;
}


module.exports = {
	createApp: createApp
};