const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors')
const register = require('./controllers/register.js');
const signIn = require('./controllers/signin.js');
const profile = require('./controllers/profile');
const image = require('./controllers/image');
const app = express();
var knex = require('knex')

const db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'frevertj',
      password : '',
      database : 'face-recog'
    }
  });

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => res.send( db.users))
app.post('/signin', (req, res) => { signIn.handleSignin(req, res, bcrypt, db) })
app.post('/register', (req, res) => { register.handleRegister(req, res, bcrypt, db) })
app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, db) })
app.put('/image', (req, res) => { image.handleImageGet(req, res, db) })
app.post('/imageurl', (req, res) => { image.handleApiCall(req, res) })


app.listen(3001, () => {
});
