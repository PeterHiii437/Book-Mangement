const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const routes = require('./routes/routes.js');
const config = require('./config/config.js');

let users = [];

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session(
    { secret: 'fingerprint' },
    (resave = true),
    (saveUninitialized = true)
  )
);

app.use('/books', function auth(req, res, next) {
  if (req.session.authorization) {
    token = req.session.authorization['accessToken'];
    jwt.verify(token, 'access', (err, user) => {
      if (err) {
        return res.status(403).json({ message: 'User not authenticated' });
      }
      req.user = user;
      next();
    });
  } else {
    return res.status(403).json({ message: 'User not logged in' });
  }
});

const doesExist = (username) => {
  let userfound = users.filter((user) => {
    return user.username === username;
  });
  if (userfound.length > 0) {
    return true;
  }
  return false;
};

const authenticatedUser = (username, password) => {
  let validusers = users.filter((user) => {
    return user.username === username && user.password === password;
  });
  if (validusers.length > 0) {
    return true;
  } else {
    return false;
  }
};

app.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!doesExist(username)) {
    return res.status(401).json({ message: 'User does not exist' });
  }
  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  let accessToken = jwt.sign(
    {
      data: password,
    },
    'access',
    { expiresIn: 60 * 60 }
  );
  return res.status(200).send('User successfully logged in!');
});

app.post('/register', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (doesExist(username)) {
    return res.status(401).json({ message: 'User already exists' });
  }
  users.push({ username: username, password: password });
  return res.status(200).send('User successfully registered!');
});

app.use('/books', routes);
app.listen(config.PORT, () => console.log('Server is running'));
