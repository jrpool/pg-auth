// Create a server application.
const app = require('express')();

// Import required modules.
const formParser = require('body-parser').urlencoded(
  {extended: false, inflate: false, limit: 200, parameterLimit: 2}
);

// Define a function that returns the requested form.
const form = method => `<!DOCTYPE html><html lang='en'>\n\n
  <head><meta charset='utf-8'><title>Form Demo App</title></head>\n\n
  <body>
    <h3>Form with method set to ${method}</h3>\n\n
    <form
      name='artist'
      action='/submit-form'
      method='${method.toLowerCase()}'
    >\n\n
      <p>
        Artist Name
        <input name='artist' type='text' size='70' maxlength='70'>
      </p>\n\n
      <p>
        Country
        <input name='country' type='text' size='60' maxlength='60'>
      </p>\n\n
      <p><button type='submit'>Submit</button></p>\n\n
    </form>\n\n
  </body>\n\n
</html>`;

// Define a function that converts an object to an indented JSON string.
const jsonify = object => JSON.stringify(object, null, 2);

/// /// CLIENT REQUEST ROUTES /// ///

// Render the GET form.
app.get(
  '/form-get',
  (req, res) => {
    res.send(form('GET'));
  }
);

// Render the POST form.
app.get(
  '/form-post',
  (req, res) => {
    res.send(form('POST'));
  }
);

// Handle the form submission.
app.all(
  '/submit-form',
  formParser,
  (req, res) => {
    const response = {'body-params': {}, 'query-params': {}};
    if (req.method === 'GET') {
      for (const property of Object.keys(req.query)) {
        response['query-params'][property] = req.query[property];
      }
    }
    else {
      for (const property of Object.keys(req.body)) {
        response['body-params'][property] = req.body[property];
      }
    }
    res.set('Content-Type', 'application/json');
    res.send(Buffer.from(jsonify(response)));
  }
);

/// /// EXECUTION /// ///

// Make the application listen for queries.
app.listen(3000, () => {
  console.log(
    'App queriable at http://localhost:3000/form-get or http://localhost:3000/form-post'
  );
});
