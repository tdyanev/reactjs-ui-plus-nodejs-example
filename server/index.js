const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const USERS = [
  {
    id: 1,
    username: 'user0001',
    password: 'abcdef',
    firstName: 'Steven',
    lastName: 'Johnson',
  },
  {
    id: 2,
    username: 'user0001',
    password: 'abcdef',
    firstName: 'Steven',
    lastName: 'Johnson',
  },
  {
    id: 3,
    username: 'user0001',
    password: 'abcdef',
    firstName: 'Steven',
    lastName: 'Johnson',
  },
];

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Content-Type', 'application/json');
  next();
});

app.get('/api/users', (req, res) => {
  res.json(USERS);
});

//FIXME must be POST method
app.get('/login', (req, res) => {
  var username = req.query.username;
  var password = req.query.password;

  res.send({ success: USERS.some(user => user.username === username && user.password === password) });
});

app.listen(3001);
