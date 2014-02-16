Package.describe({
  summary: "PredictionIO API library for Meteor Server-side",
});

Package.on_use(function (api) {
  api.use(['http', 'underscore', 'check'], 'server');
  api.add_files([ 'predictionio.js'], 'server');
  api.export('PredictionIO');
});

Package.on_test(function (api) {
  api.use(['http', 'underscore', 'check', 'tinytest'], 'server');
  api.add_files([ 'predictionio.js', 'tests/server.js'], 'server');
});