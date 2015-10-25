/**
 * @module eventLogger
 * @description
 * Adds logging to of all events to console
*/

/**
 * @function init
 * @public
 * @description
 * Fires #bindLogging on app.init
 * @listens app.init
 * @param {eventEmitter} eventEmitter The App eventEmitter
*/
function init(eventEmitter) {
	eventEmitter.on('app.init', bindLogging);
}

/**
 * @function log
 * @private
 * @description
 * Logs the event name from an eventEmitter event.
 */

function log() {
	console.log(this.event);
}

/**
 * @function bindLogging
 * @private
 * @description
 * Checks if the logging option is enabled via app.config.eventEmitter.log
 * and binds to the eventEmitter onAny
 * @param {app} app The global app
 */

function bindLogging(app) {
	if (app.config && app.config.eventEmitter && app.config.eventEmitter.log) {
		app.eventEmitter.onAny(log);
	}
}

module.exports = {
	eventLogger: {
		init: init
	}
};