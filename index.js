'use strict';

var validValue         = require('es5-ext/object/valid-value')
  , memoize            = require('memoizee/plain')
  , esniffFun          = require('esniff/function')
  , esniffFun_         = esniffFun('_')
  , esniffResolveArgs  = require('esniff/resolve-arguments')
  , isStringLiteral    = require('esniff/is-string-literal')
  , stripComments      = require('esniff/strip-comments')
  , customError        = require('es5-ext/error/custom')
  , getESniffFun
  , resolveStringLiteral
  , extractArguments
  , resolveMessage;

getESniffFun = memoize(function (prefix) {
	return esniffFun(prefix + ".bind", { asProperty: true });
});

resolveStringLiteral = function (stringLiteral, esniffResult) {
	stringLiteral = stripComments(stringLiteral).trim();
	if (!isStringLiteral(stringLiteral)) {
		throw customError("Invalid invocation with param: " +
				JSON.stringify(stringLiteral) + " for the following params: "
				+ JSON.stringify(esniffResult),
			"INVALID_INVOCATION_PARAM_NOT_STRING");
	}
	return new Function("'use strict'; return " + stringLiteral)();
};

extractArguments = function (esniffResult) {
	var args = esniffResolveArgs(esniffResult.raw);
	if (!args.length) {
		throw customError("Invalid invocation, " +
				"esniff passed : " + JSON.stringify(esniffResult),
			"INVALID_INVOCATION_MISSING_PARAM");
	}
	return args;
};

resolveMessage = function (esniffResult) {
	var args = extractArguments(esniffResult);
	args[0] = resolveStringLiteral(args[0], esniffResult);
	if (args.length > 2) { //plural
		args[1] = resolveStringLiteral(args[1], esniffResult);
		return 'n\0' + args[0] + '\0' + args[1];
	}
	return args[0];
};

module.exports = function (source/*, options*/) {
	var context, result = {}, options, i18Prefix, occurrences, clearKey,
		args;
	source = String(validValue(source));
	options = Object(arguments[1]);
	i18Prefix = options.i18Prefix || 'i18n';
	context = getESniffFun(i18Prefix)(source);
	if (context[0] && context[0].raw) {
		args = extractArguments(context[0]);
		result.context = resolveStringLiteral(args[0], context[0]);
	} else {
		result.context = 'default';
	}
	result.messages = Object.create(null);

	occurrences = esniffFun_(source);
	occurrences.forEach(function (o) {
		clearKey = resolveMessage(o);
		delete o.raw;
		if (result.messages[clearKey]) {
			result.messages[clearKey].push(o);
		} else {
			result.messages[clearKey] = [o];
		}
	});

	return result;
};
