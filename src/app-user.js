// Create a server application.
const app = require('express')();

// Import required modules.
const formParser = require('body-parser').urlencoded(
  {extended: false, inflate: false, limit: 300, parameterLimit: 3}
);
const cookieSession = require('cookie-session');
const bcryptjs = require('bcryptjs');
const {handleMessage, errorHandlerFn, messages} = require('./messages');
const pgp = require('pg-promise')();

// /// DOCUMENT TEMPLATES /// ///

// Define a function that returns an HTML document.
const htmlDoc = (title, bodyContent) =>
  `<!DOCTYPE html><html lang='en'>\n
    <head>
      <meta charset='utf-8'>
      <title>${title}</title>
    </head>\n
    <body>
      ${bodyContent}
    </body>\n
  </html>`;

// Define a function that returns the non-personalized home document.
const anonHome = () => {
  const bodyContent = `<h3>${messages.anongreet}</h3>\n
    <h4><a href='/register'>${messages.reg}</a></h4>\n
    <h4><a href='/login'>${messages.login}</a></h4>\n`;
  return htmlDoc(messages.anonhome, bodyContent);
};

// Define a function that returns the personalized home document.
const memberHome = email => {
  const bodyContent = `<h3>
    ${handleMessage(messages, 'knowngreet', '=', ['«email»', email])}
    </h3>\n
    <h4><a href='/logout'>${handleMessage(messages, 'logout')}</a></h4>\n`;
  return htmlDoc(messages.knownhome, bodyContent);
};

// Define a function that returns the registration form.
const registrationForm = error => {
  const bodyContent = `<h3>${messages.regpage}</h3>\n
    ${error ? '<h2>' + messages[error] + '</h2>\n' : '';}
    <form
      name='registration'
      action='/registration'
      method='post'
    >\n\n
      <p>
        <label>${messages.email}
          <input
            name='email' type='email' size='60'
            minlength='5' maxlength='60'
            placeholder='${emailholder}'
          >
        </label>
      </p>
      <p>
        <label>${messages.pw0}
          <input
            name='password' type='password' size='60'
            minlength='5' maxlength='60'
          >
        </label>
      </p>
      <p>
        <label>${messages.pw1}
          <input
            name='repassword' type='password' size='60'
            minlength='5' maxlength='60'
          >
        </label>
      </p>
      <p>
        <button name='register' type='submit' value='1'>${messages.reg}</button>
      </p>\n\n
    </form>\n\n`;
  return htmlDoc(messages.regpage, bodyContent);
};

// Define a function that returns the login form.
const loginForm = error => {
  const bodyContent = `<h3>${messages.logpage}</h3>\n
    ${error ? '<h2>' + messages[error] + '</h2>\n' : '';}
    <form
      name='login'
      action='/login'
      method='post'
    >\n\n
      <p>
        <label>Your email address
          <input
            name='email' type='email' size='60'
            minlength='5' maxlength='60'
            placeholder='you@domain.tld'
          >
        </label>
      </p>
      <p>
        <label>Your password
          <input
            name='password' type='password' size='60'
            minlength='5' maxlength='60'
          >
        </label>
      </p>
      <p>
        <button name='login' type='submit' value='1'>${messages.login}</button>
      </p>\n\n
    </form>\n\n`;
  return htmlDoc(${messages.logpage}, bodyContent);
};

// /// SESSION MANAGEMENT /// //

// Configure session management for secure 60-day cookies.
app.use(cookieSession({
  name: 'session',
  secret: 'How secret can it be if it is here?',
  maxAge: 5184000000,
  path: '/',
  sameSite: 'strict',
  httpOnly: true,
  signed: true,
  overwrite: true
}));

// Define a function that manages a session for a GET request.
const getSessionManager = (req, res, next) => {
  if (req.session.id) {
    const originalCookie = cryptr.decrypt(req.cookies.userData);
    try {
      req.session = JSON.parse(originalCookie);
    }
    catch (err) {
      handleMessage(messages, 'badcookie');
    }
  }
  next();
};

// Define a function that manages a session for a POST request.
const postSessionManager = (req, res, next) => {
  if (req.body.firstName) {
    req.session = req.body;
    // Store the submitted data in a cookie for 60 days.
    res.cookie(
      'userData', cryptr.encrypt(JSON.stringify(req.body)), {maxAge: 5184000000}
    );
  }
  else if (req.body.clearInfo) {
    res.clearCookie('userData');
  }
  next();
};

// /// REQUEST ROUTES /// ///

// Render the appropriate home page.
app.get(
  '/',
  (req, res) => {
    if (req.session.isPopulated) {

      res.end(knownForm(
        userData.firstName, userData.lastName, userData.favoriteColor
      ));
    }
    else {
      res.send(anonForm());
    }
  }
);

// Handle a form submission.
app.post(
  '/',
  cookieParser(),
  formParser,
  postSessionManager,
  (req, res) => {
    // Handle the non-personalized (information-submission) form.
    if (req.body.firstName) {
      // Respond with the personalized form.
      res.send(knownForm(
        req.body.firstName, req.body.lastName, req.body.favoriteColor
      ));
    }
    // Handle the personalized (cookie-clearing) form.
    else if (req.body.clearInfo) {
      res.send(anonForm());
    }
  }
);

/// /// EXECUTION /// ///

// Make the application listen for queries.
app.listen(3000, () => {
  console.log('App queriable at http://localhost:3000/');
});
