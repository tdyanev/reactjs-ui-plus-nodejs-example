const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const USERS = [
  {
    id: 1,
    userName: 'user0001',
    password: 'abcdef',
    firstName: 'Steven',
    lastName: 'Johnson',
  },
  {
    id: 2,
    userName: 'user0001',
    password: 'abcdef',
    firstName: 'Steven2',
    lastName: 'Johnson',
  },
  {
    id: 3,
    userName: 'user0001',
    password: 'abcdef',
    firstName: 'Steven',
    lastName: 'Johnson3',
  },
  {
    id: 4,
    userName: 'user004',
    password: 'abcdef',
    firstName: 'Adam',
    lastName: 'S',
  },
  {
    id: 5,
    userName: 'user0001',
    password: 'abcdef',
    firstName: 'Bond',
    lastName: 'W',
  },
  {
    id: 6,
    userName: 'user0001',
    password: 'abcdef',
    firstName: 'Steven6',
    lastName: 'Johnson',
  },
  {
    id: 7,
    userName: 'user0001',
    password: 'abcdef',
    firstName: 'Walter',
    lastName: 'Johnson',
  },
  {
    id: 8,
    userName: 'user0001',
    password: 'abcdef',
    firstName: 'Steven',
    lastName: 'Johnso88888888n',
  },
  {
    id: 9,
    userName: 'user0001',
    password: 'abcdef',
    firstName: 'Steven',
    lastName: 'Johnson',
  },
  {
    id: 10,
    userName: 'user101',
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
  var sortBy = req.query.sortby || 'id';
  var sortType = req.query.sorttype || 'asc';

  var collection = USERS.map(user => {
    user.password = null;
    return user;
  }).sort((a, b) => a[sortBy] - b[sortBy]);

  if (sortType === 'desc') {
    collection.reverse();
  }
  //console.log(collection);

  res.json(collection);
});

//FIXME must be POST method
app.get('/login', (req, res) => {
  var userName = req.query.username;
  var password = req.query.password;

  //console.log(USERS, userName, password);
  res.send({ success: USERS.some(user => user.userName === userName && user.password === password) });
});

app.listen(3001);
