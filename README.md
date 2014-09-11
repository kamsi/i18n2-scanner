# i18n2-scanner
## Scanner utility for [i18n2](https://github.com/medikoo/i18n2)

### Installation

	$ npm install i18n2-scanner

### Description

Scanner is used to parse source (using [esniff](https://github.com/medikoo/esniff)) code and search for occurrences of `_` function.
It produces json parsable structure with all the messages found in the code.


### Structure

The i18n2-scanner constists of [index.js](#indexjs) (main module) and [merge-maps](#merge-mapsjs) (module for merging scanner results). The scanner itself ([index.js](#indexjs)) takes source parameter and an optional options object.
The source parameter is assumed to be content of a JavaScript file.
The options parameter may contain i18Prefix field in which a string can be given. The i18Prefix can be used to specify the name of the i18n object (default _i18n_).

### Usage

#### index.js
Scanner is meant to parse content of JavaScript files and extract the language keys with some meta information about them (for example key's location in files). The scanner assumes that the i18n function is named `_`. The standard usage would be to feed file contents of a a file that may use `_` function to scanner (index.js). Scanner will return an object of the form:
```javascript
{
 context: "context name",
 messages: {
  "n\u0000Singular\u0000Plural":[{"point":455,"line":12,"column":70}],
  "Regular Key":[{"point":825,"line":22,"column":70}],
  "Some other key":[{"point":1027,"line":29,"column":26}]
  }
}
```
#### merge-maps.js
If we have many contexts and many files in which `_` function appears, we can create a more useful map by gathering all the particular scanner results in a map of the form:

```javascript
{
 "path/to/file-with-tranlation": scannerResultObject,
 "path/to/file-with-tranlation-other": scannerResultObject2
}
```

We can use such map as an input for merge-maps. The merge-maps will produce the output of the form:

```javascript
{
 "Some language key":
  {"Some Context":
    [
     {"fileName": "/path/to/file.js","point":991,"line":33,"column":23},
     {"fileName": "/path/to/file.js","point":1200,"line":50,"column":20}
    ]
 },
 "Other key":
  {"other context":
    [
     {"fileName":"path/to/otherfile.js","point":375,"line":11,"column":28}
    ]
  }
}
```
So the merge-maps module groups scanner results by language keys, then by context and gives information on where a specific `_` function (or i18n method in case of contexts) invocation has ocurred.


## Tests [![Build Status](https://travis-ci.org/kamsi/i18n2-scanner.svg)](https://travis-ci.org/kamsi/i18n2-scanner)

	$ npm test
