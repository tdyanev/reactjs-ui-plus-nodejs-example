const express = require('express');
const app = express();

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


app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

app.get('/api/users', (req, res) => {
  res.json(USERS);
});

//app.post('/login')

app.listen(3001);
