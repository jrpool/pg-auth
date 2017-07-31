// Create a server application.
const app = require('express')();

// Import required modules.
const formParser = require('body-parser').urlencoded(
  {extended: false, inflate: false, limit: 100, parameterLimit: 2}
);
const cookieParser = require('cookie-parser');

// Define a function that returns an HTML document.
const htmlDoc = bodyContent => {
  `<!DOCTYPE html><html lang='en'>\n\n
    <head>
      <meta charset='utf-8'>
      <title>Welcome back to Cookie1</title>
    </head>\n\n
    <body>
      ${bodyContent}
    </body>\n\n
  </html>`
};

// Define a function that returns the non-personalized document.
const anonForm = () => {
  const bodyContent = `<h3>Welcome, stranger! What’s your name?</h3>\n\n
    <form
      name='userInfo'
      action='/'
      method='post'
    >\n\n
      <p>
        <label>Your name here
          <
            input name='userName' type='text' size='70'
            minlength='1' maxlength='70'
            placeholder='Your name here'
          >
        </label>
      </p>\n\n
      <p><button type='submit'>Save my name!</button></p>\n\n
    </form>\n\n`;
  return htmlDoc(bodyContent);
};

// Define a function that returns the personalized document.
const knownForm = userName => {
  const bodyContent = `<h3>Welcome back, ${userName}</h3>\n\n
    <form
      name='userClear'
      action='/'
      method='post'
    >\n\n
      <p><button type='submit'>Clear name</button></p>\n\n
    </form>\n\n`;
  return htmlDoc(bodyContent);
};

/// /// REQUEST ROUTES /// ///

// Render the appropriate form.
app.get(
  '/',
  cookieParser,
  (req, res) => {
    if (req.cookies.userName) {
      res.send(knownForm(req.cookies.userName));
    }
    else {
      res.send(anonForm);
    }
  }
);

// Handle a form submission.
app.post(
  '/submit-form',
  cookieParser,
  formParser,
  (req, res) => {
    // Handle the non-personalized (name-submission) form.
    if (req.body.forms[0] === 'userInfo') {
      const userName = req.body.userName;
      res.cookie('userName', userName);
      res.send(knownForm(userName));
    }
    else {
      // Handle the personalized (cookie-clearing) form.
      res.clearCookie(req.cookies.userName);
      res.send(anonForm);
    }
  }
);

/// /// EXECUTION /// ///

// Make the application listen for queries.
app.listen(3000, () => {
  console.log('App queriable at http://localhost:3000/');
});
