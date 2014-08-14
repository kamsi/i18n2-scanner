'use strict';

var forEach = require('es5-ext/object/for-each');

module.exports = function (sourceScanResults) {
	var result = {}, resultMsgObject;
	forEach(sourceScanResults, function (scanRes, scanResKey) {
		if (!scanRes.messages) {
			return;
		}
		forEach(scanRes.messages, function (msg, msgKey) {
			if (!result[msgKey]) {
				result[msgKey] = {};
			}
			if (!result[msgKey][scanRes.context]) {
				result[msgKey][scanRes.context] = [];
			}
			msg.forEach(function (msgMetaDesc) {
				resultMsgObject = { fileName: scanResKey };
				forEach(msgMetaDesc, function (value, key) {
					resultMsgObject[key] = value;
				});
				result[msgKey][scanRes.context].push(resultMsgObject);
			});
		});
	});
	return result;
};
