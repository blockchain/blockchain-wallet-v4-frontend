This directory is an overlay on top of the /packages/main-process/src directory.
This means that if an imported file isn't found during compilation then the file
of the same name in /packages/main-process/src will be used instead.  The
implementation of this behavior is in /scripts/babel.config.js.
