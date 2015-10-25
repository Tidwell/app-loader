var App = require('../index.js');

it("should have a create method", function() {
  expect(App.createApp).toBeDefined();
});

var instance = App.createApp();

it("should return a new app instance", function() {
  expect(instance).toBeDefined();
});