'use strict';
var prependUrl = require('./prependurl.js');

//
// CSSProcessor takes care, and processes CSS files.
// It is given:
//   - A base directory, which is the directory under which to look at references files
//   - A destination directory, which is the directory under which will be generated the files
//   - A file content to be processed
//   - a file replacement locator
//   - a host URL to prepend to revved resources whose URL starts with a /
//   - an optional log callback that will be called as soon as there's something to log
//
var CSSProcessor = module.exports = function (src, dest, content, revvedfinder, hostUrl, isContentFileRevved, logcb) {
  this.content = content;
  this.filepath = src;
  this.linefeed = /\r\n/g.test(this.content) ? '\r\n' : '\n';
  this.revvedfinder = revvedfinder;
  this.hostUrl = typeof hostUrl === 'string' ? hostUrl.replace(/\/$/, '') : undefined;
  this.isContentFileRevved = isContentFileRevved;
  this.logcb = logcb || function () {};
};

//
// Calls the log callback function
//
CSSProcessor.prototype.log = function log(msg) {
  this.logcb(msg);
};

// Process the CSS file, which is:
//  - replace image references by their revved version
//
CSSProcessor.prototype.process = function process() {
    var self = this;
    // Replace reference to images with the actual name of the optimized image
    this.log('Update the CSS with new img filenames');
    return this.content.replace(/url\(\s*['"]?([^'"\)#?]+)(?:[#?](?:[^'"\)]*))?['"]?\s*\)/gm, function (match, src) {
      // Consider reference from site root
      var file = self.revvedfinder.find(src, self.filepath);

      file = prependUrl(file, src, self.hostUrl, self.isContentFileRevved);

      var res = match.replace(src, file);

      if (src !== file) {
        self.log(match + ' changed to ' + res);
      }
      return res;
    });
  };
