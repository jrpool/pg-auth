# cookie1
Express application that stores a plain-text cookie

## Project Members

[Jonathan Pool](https://github.com/jrpool)

## modules

```
/app1/app.js
```

## Discussion

### General

This application demonstrates the use of the [`express` package][exp] and the [`cookie-parser` package][cp] to create an application that serves and processes POST forms and manages a plain-text cookie.

The demonstration takes the form of a website that allows a user to register and, thereafter, serves personalized content to that user.

The application fulfills the requirements of the App1 compenent of the Secure Session Cookie exercise in the “Adding State to HTTP” module in Phase 2 of the [Learners Guild][lg] curriculum.

## Installation and Setup

0. These instructions presuppose that (1) [npm][npm] is installed.

1. Your copy of this project will be located in its own directory, inside some other directory that you may choose or create. For example, to create that parent directory inside your own home directory’s `Documents` subdirectory and call it `projects`, you can execute:

    `mkdir ~/Documents/projects`

Make that parent directory your working directory, by executing, for example:

    `cd ~/Documents/projects`

2. Clone this project’s repository into it, thereby creating the project directory, named `cookie1`, by executing:

    `git clone https://github.com/jrpool/cookie1.git json-api-promise`

2. Make the project directory your working directory by executing:

    `cd cookie1`

3. Install required dependencies (you can see them listed in `package.json`) by executing:

    `npm i`

## Usage and Examples

To start the application, execute `npm start` (or, if under Windows, `npm run startwin`).

To access the application while it is running, use a web browser to request this URL:

`http://localhost:3000/`

Complete the form that is served and submit it.

The response to your submission will be another, personalized form allowing you to request the deletion of the information that you provided. If you make that request, the response will be the original form.

The application stores your information in a cookie among your browser’s files. As long as the cookie remains in existence, subsequent visits to the same URL with the same browser instance will elicit the personalized form. If you prevent the storage of that cookie or cause the cookie to be deleted after creation, subsequent visits to the URL will elicit the original, non-personalized form.

To stop the application, send a SIGINT signal to its process, by entering the keypress CONTROL-C in the terminal window.

To perform linting, execute `npm run lint`.

[cp]: https://www.npmjs.com/package/cookie-parser
[exp]: https://www.npmjs.com/package/express
[lg]: https://www.learnersguild.org
