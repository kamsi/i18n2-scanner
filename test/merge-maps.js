'use strict';

var fs = require('fs')
  , deferred = require('deferred')
  , promisify = deferred.promisify
  , readFile = promisify(fs.readFile);

module.exports = function (t, a, d) {
	deferred(
		readFile('test/__playground/view_example_output.json'),
		readFile('test/__playground/view_example_2_output.json'),
		readFile('test/__playground/after_merge_output.json')
	).done(function (result) {
		var input = {};
		input['test/__playground/view_example_output.json'] =
			JSON.parse(String(result[0]));
		input['test/__playground/view_example_2_output.json'] =
			JSON.parse(String(result[1]));
		a.deep(t(input), JSON.parse(String(result[2])));
		d();
	}, d);
};
