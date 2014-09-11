# i18n2-scanner
## Scanner utility for [i18n2](https://github.com/medikoo/i18n2)

### Installation

	$ npm install i18n2-scanner

### Description

Scanner is used to parse source (using [esniff](https://github.com/medikoo/esniff)) code and search for occurrences of _ function.
It produces json with all the messages found in the code.

## Output

If everything went well the scanner produces a map of the following form:
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
Map groups by language keys, then by context and gives information on where a specific _ function (or method) invocation has ocurred.

## Tests [![Build Status](https://travis-ci.org/kamsi/i18n2-scanner.svg)](https://travis-ci.org/kamsi/i18n2-scanner)

	$ npm test
