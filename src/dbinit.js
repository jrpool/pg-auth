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

// Perform the database creation.
const dbInit = new QueryFile('../sql/dbinit.sql');
db.task('dbinit', dbproto => dbproto.none(dbInit))
  .then(() => handleMessage(messages, 'dbinit'))
  .catch(err => {
    handleMessage(
      messages, 'error', errorHandlerFn(err), ['«unit»', 'dbinit']
    );
  });
