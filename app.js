// Create a server application.
const app = require('express')();

// Import required modules.
const formParser = require('body-parser').urlencoded(
  {extended: false, inflate: false, limit: 150, parameterLimit: 3}
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
  const bodyContent = `<h3>Welcome, stranger! Tell us about yourself.</h3>\n\n
    <form
      name='userInfo'
      action='/'
      method='post'
    >\n\n
      <p>
        <label>First name
          <input
            name='firstName' type='text' size='40'
            minlength='1' maxlength='40'
            placeholder='First name'
          >
        </label>
      </p>
      <p>
        <label>Last name
          <input
            name='lastName' type='text' size='40'
            minlength='0' maxlength='40'
            placeholder='Last name'
          >
        </label>
      </p>
      <p>
        <label>Favorite color
          <input
            name='favoriteColor' type='text' size='40'
            minlength='1' maxlength='40'
            placeholder='Favorite color'
          >
        </label>
      </p>\n\n
      <p><button type='submit'>That’s me!</button></p>\n\n
    </form>\n\n`;
  return htmlDoc('Welcome to Cookie2', bodyContent);
};

// Define a function that returns the personalized document.
const knownForm = (firstName, lastName, favoriteColor) => {
  const fullName = firstName + (lastName.length ? ' ' + lastName : '');
  const bodyContent = `<h3>Welcome back, ${fullName}! I bet your favorite color is ${favoriteColor}.</h3>\n\n
    <form
      name='userClear'
      action='/'
      method='post'
    >\n\n
      <p><button name='clearInfo' type='submit'>Clear my info</button></p>\n\n
    </form>\n\n`;
  return htmlDoc('Welcome back to Cookie2', bodyContent);
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
    // Handle the non-personalized (information-submission) form.
    if (req.body.firstName !== undefined) {
      // Store the submitted data in a cookie for 60 days.
      res.cookie('userData', JSON.stringify(req.body), {maxAge: 5184000000});
      // Respond with the personalized form.
      res.send(knownForm(
        req.body.firstName, req.body.lastName, req.body.favoriteColor
      ));
    }
    // Handle the personalized (cookie-clearing) form.
    else if (req.body.clearInfo !== undefined) {
      res.clearCookie('userData');
      res.send(anonForm());
    }
  }
);

/// /// EXECUTION /// ///

// Make the application listen for queries.
app.listen(3000, () => {
  console.log('App queriable at http://localhost:3000/');
});
