#App Loader

A basic eventEmitter based App loader


##Example

```
//index.js
var loader = require('app-loader');

var appOptions = {
	glob: {
		pattern: './modules/**/*.js'
	},
	eventEmitter: {
		log: true
	}
};

var app = loader.createApp(appOptions);

app.eventEmitter.on('app.ready', function(app) {
	console.log(app)
});

```

```
//modules/my-module.js

function init(evenEmitter) {
	evenEmitter.on('app.ready', function(app){
		console.log('do stuff')
	});
}

var myModule = {
	init: init
};

module.exports = {
	myModule: myModule
};

```

##Install

``npm install``



##Test

``grunt test``

OR

``npm test``



##Docs

``grunt docs``

