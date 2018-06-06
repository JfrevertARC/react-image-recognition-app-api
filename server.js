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
      connectionString : process.env.DATABASE_URL,
      ssl: true,
    }
  });

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => res.send('it works!'))
app.post('/signin', (req, res) => { signIn.handleSignin(req, res, bcrypt, db) })
app.post('/register', (req, res) => { register.handleRegister(req, res, bcrypt, db) })
app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, db) })
app.put('/image', (req, res) => { image.handleImageGet(req, res, db) })
app.post('/imageurl', (req, res) => { image.handleApiCall(req, res) })


app.listen(process.env.PORT || 3000, () => {
  console.log(`app is running on port ${process.env.port}`)
});
