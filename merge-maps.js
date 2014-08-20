'use strict';

var forEach = require('es5-ext/object/for-each')
  , assign  = require('es5-ext/object/assign');

module.exports = function (sourceScanResults) {
	var result = Object.create(null), resultMsgObject;
	forEach(sourceScanResults, function (meta, location) {
		if (!meta.messages) {
			return;
		}
		forEach(meta.messages, function (msg, msgKey) {
			if (!result[msgKey]) {
				result[msgKey] = Object.create(null);
			}
			if (!result[msgKey][meta.context]) {
				result[msgKey][meta.context] = [];
			}
			msg.forEach(function (msgMetaDesc) {
				resultMsgObject = { fileName: location };
				assign(resultMsgObject, msgMetaDesc);
				result[msgKey][meta.context].push(resultMsgObject);
			});
		});
	});
	return result;
};
