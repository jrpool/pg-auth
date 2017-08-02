/*
  Define a function that formulates and delivers a message, optionally
  replacing placeholders.
  Preconditions:
    0. messages is an object.
    1. messageKey is one of the properties of messages.
    2. handler (optional) is a function with 1 string argument.
    2. fromTo (optional) is an array of 2 elements:
      a. a nonblank string without any RegExp metacharacters.
      b. a string.
*/
exports.handleMessage = (messages, messageKey, handler, fromTo) => {
  let message = messages[messageKey];
  if (fromTo) {
    message = message.replace(RegExp(fromTo[0], 'g'), fromTo[1]);
  }
  if (handler) {
    handler(message);
  }
  else {
    console.log(message);
  }
};

// Define a function that returns a handler for an error message.
const errorHandlerFn = err => {
  return message => {
    console.log(message + err.message);
  };
};

// Messages in English.
exports.messages = {
  'anongreet': 'Hello, stranger.',
  'knowngreet': 'Welcome back, «email»',
  'email': 'Your email address',
  'pw': 'Your password',
  'pw0': 'A new password (5 or more characters)',
  'pw1': 'The same new password again',
  'reg': 'Register',
  'login': 'Log in',
  'logout': 'Log out',
  'nopw': 'Missing password.',
  'nopw0': 'Missing new password.',
  'nopw1': 'Missing password repetition.',
  'noemail': 'Missing email address.',
  'noregs':
    'An email address, a password, and a repeated password are required.',
  'nologins': 'Your email address and password are required.',
  'badpw1': 'The repeated password is not the same.',
  'shortpw': 'Your proposed password is too short.',
  'bademail': 'The address is not a valid email address.',
  'badlogins': 'The email address or password is incorrect.',
  'dbinit': 'The database has been created.',
  'error': 'An error has occurred in «unit». Error message:\n'
};