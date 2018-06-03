const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors')
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
app.get('/', (req, res) => {
    res.send( db.users);
})

app.post('/signin', (req, res) => {
    db.select('email', 'hash').from('login')
        .where('email', '=', req.body.email)
        .then(data => {
            const pwIsValid = bcrypt.compareSync(req.body.password, data[0].hash);
            if (pwIsValid) {
                return db.select('*').from('users')
                        .where('email', '=', req.body.email)
                        .then(user => {
                            res.json(user[0]) 
                        })
                        .catch(err => res.status(400).json('unable to get user.'))
            } else {
                res.status(400).json('Invalid credentials.');
            }
        }).catch(err => res.status(400).json('wrong credentials.'))
})

app.post('/register', (req, res) => {
    const { email, name, password }  = req.body;
    const hash = bcrypt.hashSync(password);

        db.transaction(trx => {
            trx.insert({
                hash: hash,
                email: email
            })
            .into('login')
            .returning('email')
            .then(loginEmail => {
                return trx('users')
                .returning('*')
                .insert({
                    email: loginEmail[0],
                    name: name,
                    joined: new Date()
                })
                .then(user => {
                    res.json(user[0]);
                })
            })
            .then(trx.commit)
            .catch(err => trx.rollback)
        })
        .catch(err => res.status(400).json('unable to register user.'))

})

app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    db.select('*').from('users').where({
        id: id
    }).then(user => {
        if (user.length) {
            res.json(user[0])
        } else {
            res.status(400).json('user profile could not be grabbed');
        }
    }).catch(err => res.status(400).json('Problem while getting user'))
})

app.put('/image', (req, res) => {
    const { id } = req.body;

    db('users').where("id", "=", id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
       res.json(entries[0])
    }).catch(err => res.status(400).json('Failed to retrieve user.'))
})

app.listen(3001, () => {
});
