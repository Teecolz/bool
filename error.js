/* eslint no-console: "off"*/

const error = (message, location) => {
  let msg = message;
  if (location && location.line) {
    msg += ` at line ${location.line}`;
    if (location.col) {
      msg += `, column ${location.col}`;
    }
  }
  if (!error.quiet) {
    console.log(`Error: ${msg}`);
  }
  error.count += 1;
};

error.quiet = false;
error.count = 0;

module.exports = error;
