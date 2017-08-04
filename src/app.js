// /// DEPENDENCIES /// ///

const app = require('express')();
const formParser = require('body-parser').urlencoded(
  {extended: false, inflate: false, limit: 300, parameterLimit: 4}
);
const cookieSession = require('cookie-session');
const pgp = require('pg-promise')();
const bcryptjs = require('bcryptjs');
const {handleMessage, errorHandlerFn, messages} = require('./messages');
const {isPositiveInt} = require('./validate');

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
    <h4><a href='/logout'>${messages.logout}</a></h4>\n`;
  return htmlDoc(messages.knownhome, bodyContent);
};

// Define a function that returns the registration form.
const registrationForm = error => {
  const bodyContent = `<h3>${messages.regpage}</h3>\n
    ${error ?
      '<h2 style="color: red">' + error + '</h2>\n' : ''
    }
    <form
      name='registration'
      action='/register'
      method='post'
    >\n\n
      <p>
        <label>${messages.email}
          <input
            name='email' type='email' size='60'
            minlength='5' maxlength='60'
            placeholder='${messages.emailholder}'
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
const pgauthdb = () => {
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
  address if logged in, or with a blank string if not.
*/
const userEmail = req => {
  const db = pgauthdb();
  if (
    req.session.isPopulated && req.session.id && isPositiveInt(req.session.id)
  ) {
    return db.task('get user email from database', task => {
      return task.func('getemail', req.session.id);
    })
    .then(foundUser => {
      pgp.end();
      return Promise.resolve(foundUser[0].dbemail || '');
    })
    .catch(err => {
      errorHandlerFn(err);
      pgp.end();
    });
  }
  else {
    pgp.end();
    return Promise.resolve('');
  }
};

/*
  Define a function that adds a user to the database if the email address
  is nonduplicative and returns a promise resolved with the user’s ID if
  added, or 0 if not.
  Preconditions: req.session.email and req.session.password are valid strings.
*/
const storeNewUser = req => {
  const db = pgauthdb();
  const salt = bcryptjs.genSaltSync(10);
  const pwhash = bcryptjs.hashSync(req.body.password, salt);
  return db.task('add user to database', task => {
    return task.func('adduser', [req.body.email, pwhash]);
  })
  .then(addedUser => {
    pgp.end();
    return Promise.resolve(addedUser[0].newid || 0);
  })
  .catch(err => {
    errorHandlerFn(err);
    pgp.end();
  });
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

// /// ROUTES /// ///

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
        res.redirect(301, '/');
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
        res.redirect(301, '/');
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
        res.redirect(301, '/');
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
    if (!req.body.email || req.body.email.length < 5) {
      res.end(registrationForm(messages.noemail));
    }
    else if (!req.body.password || req.body.password.length < 5) {
      res.end(registrationForm(messages.nopw0));
    }
    else if (!req.body.repassword || req.body.repassword.length < 5) {
      res.end(registrationForm(messages.nopw1));
    }
    else if (req.body.repassword !== req.body.password) {
      res.end(registrationForm(messages.badpw1));
    }
    else {
      storeNewUser(req)
      .then(newid => {
        if (newid) {
          req.session.id = newid;
          res.end(memberHome(req.body.email));
        }
        else {
          res.end(anonHome());
        }
      })
      .catch(err => {
        errorHandlerFn(err);
      });
    }
  }
);

/// /// EXECUTION /// ///

// Make the application listen for queries.
app.listen(3000, () => {
  console.log('App queriable at http://localhost:3000/');
});
