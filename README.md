# pg-auth
Express server that manages authentication with PostgreSQL.

## Project Members

[Jonathan Pool](https://github.com/jrpool)

## modules

```
app.js
```

## Discussion

### General

This application demonstrates the use of the [`express` package][exp], the [`cookie-session` package][cs], the [`bcryptjs` package][bc], and the [`pg-promise` package][pgpr] to create a server that serves and processes POST forms and manages authentication and sessions with cookies and encrypted passwords.

The demonstration takes the form of a website that allows a user to register and, thereafter, serves personalized content to that user.

The application contains only a subset of the functions that an authentication management application requires. Missing functionalities include terminating the user’s registration, changing the user’s password, changing the user’s email address, protecting the registrant from impersonation, and reminding the registered user of a forgotten password or email address.

The application fulfills the requirements of the “HTTP Authentication” module in Phase 2 of the [Learners Guild][lg] curriculum.

### Implementation notes

This implementation assigns a unique integer identifier to each registered user. It stores the identifier in a cookie on the user’s client. It relies on the tamper-resistance of cookie data provided by the `cookie-session` package.

All the persistent information about the user is stored in the PostgreSQL database. The user’s password, however, is not stored there. Instead, a 60-character hash of the password, including a plain-text salt, is stored there and is used for the validation of a user-supplied password. A new salt is generated for each registration.

## Installation and Setup

0. These instructions presuppose that (1) [npm][npm] is installed.

1. Your copy of this project will be located in its own directory, inside some other directory that you may choose or create. For example, to create that parent directory inside your own home directory’s `Documents` subdirectory and call it `projects`, you can execute:

    `mkdir ~/Documents/projects`

Make that parent directory your working directory, by executing, for example:

    `cd ~/Documents/projects`

2. Clone this project’s repository into it, thereby creating the project directory, named `pg-auth`, by executing:

    `git clone https://github.com/jrpool/pg-auth.git pg-auth`

2. Make the project directory your working directory by executing:

    `cd pg-auth`

3. Install required dependencies (you can see them listed in `package.json`) by executing:

    `npm i`

## Usage and Examples

To create the database and its owner, including its schema, execute `npm run dbinit`.

To delete the database and its owner, execute `npm run dbdrop`.

While the database exists, to start the application, execute `npm start`.

To access the application while it is running, use a web browser to request this URL:

`http://localhost:3000/`

Once you register successfully, subsequent visits from the same browser on the same client will not require logging in, until either the cookie expiration time (60 days) elapses or you log out. Thereafter, on such a visit you may log in or register. If you try to register with the email address of an existing registration, you will not be permitted to do so.

If you prevent the storage or transmission of the application’s cookie, cause the cookie to be deleted after creation, access the application from an incognito browser window, or access it from a different browser, a visit to the URL will not recognize you as registered, but you will be permitted to log in.

To stop the application, send a SIGINT signal to its process, by entering the keypress CONTROL-C in the terminal window.

To perform linting, execute `npm run lint`.

[bc]: https://www.npmjs.com/package/bcryptjs
[cs]: https://www.npmjs.com/package/cookie-session
[exp]: https://www.npmjs.com/package/express
[lg]: https://www.learnersguild.org
[pgpr]: https://www.npmjs.com/package/pg-promise
