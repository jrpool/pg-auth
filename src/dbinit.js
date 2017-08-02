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
  'create role pgauthmanager login',
  'comment on role pgauthmanager is \'Manager of user authentication\'',
  'create database pgauth owner pgauthmanager',
  'comment on database pgauth is \'User authentication database\''
];

/*
  Create the database and its owner. Use in-line queries instead of queries
  stored in an SQL file, because database creation is prohibited in a
  multi-command string. Consequently, 3 SQL files would be required.
*/
db.task('dbinit', task => {
  return task.none(queries[0])
    .then(() => {return task.none(queries[1]);})
    .then(() => {return task.none(queries[2]);})
    .then(() => {return task.none(queries[3]);})
    .then(() => {
      pgp.end();
      handleMessage(messages, 'dbinit');
    })
    .catch(err => {
      handleMessage(
        messages, 'error', errorHandlerFn(err), ['«unit»', 'dbinit']
      );
      pgp.end();
    });
});
