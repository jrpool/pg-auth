// Create a server application.
const app = require('express')();

// Import required modules.
const formParser = require('body-parser').urlencoded(
  {extended: false, inflate: false, limit: 100, parameterLimit: 2}
);
const cookieParser = require('cookie-parser');

// Define a function that returns an HTML document.
const htmlDoc = (title, bodyContent) =>
  `<!DOCTYPE html><html lang='en'>\n\n
    <head>
      <meta charset='utf-8'>
      <title>${title}</title>
    </head>\n\n
    <body>
      ${bodyContent}
    </body>\n\n
  </html>`;

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
          <input
            name='userName' type='text' size='70'
            minlength='1' maxlength='70'
            placeholder='Your name here'
          >
        </label>
      </p>\n\n
      <p><button type='submit'>Save my name!</button></p>\n\n
    </form>\n\n`;
  return htmlDoc('Welcome to Cookie1', bodyContent);
};

// Define a function that returns the personalized document.
const knownForm = userName => {
  const bodyContent = `<h3>Welcome back, ${userName}!</h3>\n\n
    <form
      name='userClear'
      action='/'
      method='post'
    >\n\n
      <p><button name='clearName' type='submit'>Clear name</button></p>\n\n
    </form>\n\n`;
  return htmlDoc('Welcome back to Cookie1', bodyContent);
};

/// /// REQUEST ROUTES /// ///

// Render the appropriate form.
app.get(
  '/',
  cookieParser(),
  (req, res) => {
    if (req.cookies.userName) {
      res.send(knownForm(req.cookies.userName));
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
  (req, res) => {
    // Handle the non-personalized (name-submission) form.
    if (req.body.userName !== undefined) {
      const userName = req.body.userName;
      // Store the name in a cookie for 60 days.
      res.cookie('userName', userName, {maxAge: 5184000000});
      res.send(knownForm(userName));
    }
    // Handle the personalized (cookie-clearing) form.
    else if (req.body.clearName !== undefined) {
      res.clearCookie('userName');
      res.send(anonForm());
    }
  }
);

/// /// EXECUTION /// ///

// Make the application listen for queries.
app.listen(3000, () => {
  console.log('App queriable at http://localhost:3000/');
});
