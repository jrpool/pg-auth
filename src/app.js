// /// DEPENDENCIES /// ///

const app = require('express')();
const formParser = require('body-parser').urlencoded(
  {extended: false, inflate: false, limit: 300, parameterLimit: 3}
);
const cookieSession = require('cookie-session');
const pgp = require('pg-promise')();
const bcryptjs = require('bcryptjs');
const {handleMessage, errorHandlerFn, messages} = require('./messages');
const {isPositiveInt, isPositiveIntRange} = require('./validate');

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
    ${error ? '<h2>' + error + '</h2>\n' : ''}
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
    ${error ? '<h2>' + error + '</h2>\n' : ''}
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
            placeholder='${messages.emailholder}'
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
  return htmlDoc(messages.logpage, bodyContent);
};

// /// UTILITIES /// //

// Define a function that creates and returns a database instance.
const db = () => {
  const cn = {
    host: 'localhost',
    port: 5432,
    user: 'pgauthmanager',
    database: 'pgauth'
  };
  return pgp(cn);
};

/*
  Define a function that returns a promise resolved with the user’s email
  address if logged in, or null if not.
*/
const userEmail = req => {
  const db = db();
  if (
    req.session.isPopulated && req.session.id && isPositiveInt(req.session.id)
  ) {
    return db.task('get user email from database', task => {
      return task.one('select email from users where id = ' + req.session.id);
    })
    .catch(err => {
      errorHandlerFn(err);
    }
  }
};

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

// /// REQUEST ROUTES /// ///

// Home page.
app.get(
  '/',
  (req, res) => {
    userEmail(req)
      .then(email => {
        if (email) {
          res.end(memberHome(email));
        }
        else {
          res.end(anonHome());
        }
      })
      .catch(err => {
        errorHandlerFn(err);
      });
  }
);

// Registration form.
app.get(
  '/register',
  (req, res) => {
    userEmail(req)
      .then(email => {
        if (email) {
          res.end(memberHome(email));
        }
        else {
          res.end(registrationForm());
        }
      })
      .catch(err => {
        errorHandlerFn(err);
      });
  }
);

// Login form.
app.get(
  '/login',
  (req, res) => {
    userEmail(req)
      .then(email => {
        if (email) {
          res.end(memberHome(email));
        }
        else {
          res.end(loginForm());
        }
      })
      .catch(err => {
        errorHandlerFn(err);
      });
  }
);

// Logout.
app.get(
  '/logout',
  (req, res) => {
    userEmail(req)
      .then(email => {
        if (email) {
          req.session = null;
          res.end(anonHome());
        }
        else {
          res.end(anonHome());
        }
      })
      .catch(err => {
        errorHandlerFn(err);
      });
  }
);

// Registration form submission.
app.post(
  '/register',
  formParser,
  (req, res) => {
    if (req.body.email) {
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
