# cookie3
Express application that manages sessions.

## Project Members

[Jonathan Pool](https://github.com/jrpool)

## modules

```
app.js
```

## Discussion

### General

This application demonstrates the use of the [`express` package][exp] and the [`cookie-parser` package][cp] to create an application that serves and processes POST forms and manages sessions.

The demonstration takes the form of a website that allows a user to register and, thereafter, serves personalized content to that user.

The application fulfills the requirements of the “App 3—An insecure session” compenent of the Secure Session Cookie exercise in the “Adding State to HTTP” module in Phase 2 of the [Learners Guild][lg] curriculum.

## Installation and Setup

0. These instructions presuppose that (1) [npm][npm] is installed.

1. Your copy of this project will be located in its own directory, inside some other directory that you may choose or create. For example, to create that parent directory inside your own home directory’s `Documents/projects` subdirectory and call it `cookies`, you can execute:

    `mkdir ~/Documents/projects/cookies`

Make that parent directory your working directory, by executing, for example:

    `cd ~/Documents/projects/cookies`

2. Clone this project’s repository into it, thereby creating the project directory, named `app3`, by executing:

    `git clone https://github.com/jrpool/cookie2.git app3`

2. Make the project directory your working directory by executing:

    `cd app3`

3. Install required dependencies (you can see them listed in `package.json`) by executing:

    `npm i`

## Usage and Examples

To start the application, execute `npm start`.

To access the application while it is running, use a web browser to request this URL:

`http://localhost:3000/`

Complete the form that is served and submit it.

The response to your submission will be another, personalized form allowing you to request the deletion of the information that you provided. If you make that request, the response will be the original form.

The application stores your information in a cookie, set to expire in 60 days, among your browser’s files. As long as the cookie remains in existence, subsequent visits to the same URL with the same browser instance will elicit the personalized form. If you prevent the storage or transmission of that cookie, cause the cookie to be deleted after creation, or access the application from an incognito browser window, subsequent visits to the URL will elicit the original, non-personalized form.

To stop the application, send a SIGINT signal to its process, by entering the keypress CONTROL-C in the terminal window.

To perform linting, execute `npm run lint`.

[cp]: https://www.npmjs.com/package/cookie-parser
[exp]: https://www.npmjs.com/package/express
[lg]: https://www.learnersguild.org
