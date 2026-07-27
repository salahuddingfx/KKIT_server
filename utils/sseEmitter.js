const EventEmitter = require("events");

class AppEventEmitter extends EventEmitter {}

const appEventEmitter = new AppEventEmitter();
appEventEmitter.setMaxListeners(500);

module.exports = appEventEmitter;
