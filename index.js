'use strict';

var esniffFun = require('esniff/function')
  , esniffResolveArgs = require('esniff/resolve-arguments')
  , clearRaw
  , validValue = require('es5-ext/object/valid-value')
  , defaultI18nPrefix = 'i18n'
  , clearOutput
  , validStringLiteral = require('esniff/valid-string-literal')
  , stripComments = require('esniff/strip-comments');

clearOutput = function (str) {
	try {
		str = new Function("'use strict'; return " + str)();
	} catch (e) {
		throw e;
	}
	return str;
};

clearRaw = function (raw) {
	var args = esniffResolveArgs(raw);
	if (!args.length) {
		throw "Invalid invocation of _ function with params: " + raw;
	}
	args[0] = validStringLiteral(stripComments(args[0]).trim());
	if (args.length > 2) { //plural
		args[1] = validStringLiteral(stripComments(args[1]).trim());
		return 'n\0' + clearOutput(args[0]) + '\0' + clearOutput(args[1]);
	}
	return clearOutput(args[0]);
};

module.exports = function (fileContent/*, options*/) {
	var context, result = {}, options, i18Prefix, occurrences, clearKey;
	fileContent = String(validValue(fileContent));
	options = Object(arguments[1]);
	i18Prefix = options.i18Prefix || defaultI18nPrefix;
	context = esniffFun(i18Prefix + ".bind", { asProperty: true })(fileContent);
	if (context[0] && context[0].raw) {
		result.context = clearRaw(context[0].raw);
	} else {
		result.context = '';
	}
	result.messages = Object.create(null);

	occurrences = esniffFun('_')(fileContent);
	occurrences.forEach(function (o) {
		clearKey = clearRaw(o.raw);
		if (result.messages[clearKey]) {
			result.messages[clearKey].push(o);
		} else {
			result.messages[clearKey] = [o];
		}
		delete o.raw;
	});

	return result;
};
