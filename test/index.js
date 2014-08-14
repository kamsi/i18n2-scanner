'use strict';

var fs = require('fs')
  , deferred = require('deferred')
  , promisify = deferred.promisify
  , readFile = promisify(fs.readFile);

module.exports = function (t, a, d) {
	var testFilePaths = ['test/__playground/view_example.js',
		'test/__playground/view_example_2.js'];

	deferred.map(testFilePaths, function (path) {
		return deferred(readFile(path),
			readFile(path.replace(/_?\.js$/, '_output.json'))).then(
			function (result) {
				a.deep(t(result[0]), JSON.parse(String(result[1])));
			}
		);
	}).done(function (res) {
		d();
	}, d);
};
