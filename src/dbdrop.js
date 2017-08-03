// Import required modules.
const pgp = require('pg-promise')();
const {handleMessage, errorHandlerFn, messages} = require('./messages');

// Create the pgauth database and its owner.
const cn = {
  host: 'localhost',
  port: 5432,
  database: 'postgres'
};
const db = pgp(cn);

// Identify the required queries.
const queries = [
  'drop database pgauth',
  'drop role pgauthmanager'
];

// Delete the database and its owner.
db.task('dbinit', task => {
  return task.none(queries[0])
  .then(() => {return task.none(queries[1]);})
  .then(() => {
    pgp.end();
    handleMessage(messages, 'dbdropped');
  })
  .catch(err => {
    handleMessage(
      messages, 'error', errorHandlerFn(err), ['«unit»', 'dbdrop']
    );
    pgp.end();
  });
});
