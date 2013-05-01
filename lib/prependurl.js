'use strict';

/**
 * This function will transform filename into a host-prefixed
 * version of itself iff
 *     filename is revved and root-relative (i.e. was sourced with a leading slash)
 *     OR
 *     filename is revved and non-root-relative (i.e. sourced without a leading slash) and the
 *     contentFilename is not revved.
 *
 * This ensures that all revved assets are in the end served from hostUrl (like CDN), whether
 * by having the hostUrl prepended explicitly, or by being served relative to a document which
 * had a URL prepended.
 */
module.exports = function(filename, sourceFilename, hostUrl, isContentFileRevved) {
  // don't want hostname prepending
  if (hostUrl === undefined) {
    return filename;
  }

  // file not revved
  if (sourceFilename === filename) {
    return filename;
  }

  // root-relative revved URLs always get prepended
  if (filename.charAt(0) === '/') {
    return hostUrl + filename;
  }

  if (!isContentFileRevved) {
    return hostUrl + '/' + filename;
  }

  return filename;
};
