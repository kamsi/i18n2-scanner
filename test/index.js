'use strict';

var fs = require('fs');

module.exports = function (t, a, d) {
	fs.readFile('test/__playground/view_example.js', { encoding: 'utf-8' },
		function (err, example) {
			if (err) throw err;
			fs.readFile('test/__playground/view_example_output.json',
				{ encoding: 'utf-8' }, function (err2, output) {
					if (err2) throw err2;
					d(a(JSON.stringify(t(example)), output,
						'Is source parser returning context correctly?'));
				});
		});
};
