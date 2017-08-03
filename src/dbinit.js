// Import required modules.
const pgp = require('pg-promise')();
const {handleMessage, errorHandlerFn, messages} = require('./messages');

// Create a database instance for creating the pgauth database and its owner.
const cnmake = {
  host: 'localhost',
  port: 5432,
  database: 'postgres'
};
const dbmake = pgp(cnmake);

// Create a database instance for creating the database schema.
const cnschema = {
  host: 'localhost',
  port: 5432,
  user: 'pgauthmanager'
  database: 'pgauth'
};
const dbmake = pgp(cnmake);
const dbschema = pgp(cnschema);

// Identify the required queries for creating the database and its owner.
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
dbmake.task('dbmake', task => {
  return task.none(queries[0])
    .then(() => {return task.none(queries[1]);})
    .then(() => {return task.none(queries[2]);})
    .then(() => {return task.none(queries[3]);})
    .then(() => {
      pgp.end();
      return handleMessage(messages, 'dbmade');
    })
    .catch(err => {
      handleMessage(
        messages, 'error', errorHandlerFn(err), ['«unit»', 'dbmake']
      );
      pgp.end();
    });
});

// Create the database schema.
dbschema.task('dbschema', task => {
  return task.none(new QueryFile('../src/schema.sql'));
    })
    .then(() => {
      pgp.end();
      return handleMessage(messages, 'dbfilled');
    })
    .catch(err => {
      handleMessage(
        messages, 'error', errorHandlerFn(err), ['«unit»', 'dbschema']
      );
      pgp.end();
    });
});
