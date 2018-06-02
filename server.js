const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());

const db = {
    users: [
        {
            id: "100",
            name: "Joey",
            email: "jodog@email.com",
            password: "jenga5",
            entries: 0,
            joined: new Date()
        },
        {
            id: "101",
            name: "Sarah",
            email: "sdog@email.com",
            password: "dior44",
            entries: 0,
            joined: new Date()
        },
    ]
}

app.get('/', (req, res) => {
    res.send( db.users);
})

app.post('/signin', (req, res) => {
   if (req.body.email === db.users[0].email &&
    req.body.password === db.users[0].password
) {
    res.json('success')
   } else {
       res.status(400).json('error logging in')
   }
})

app.post('/register', (req, res) => {
    const { email, name, password }  = req.body;
    console.log(req.body)
    db.users.push({
        id: "102",
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        entries: 0,
        joined: new Date()
    })
    res.json(db.users[db.users.length -1])
})

app.get('/profile/:id', (req, res) => {
    // const { id } = req.params.id;
    let found = false;

    db.users.forEach( user => {
        if (user.id === req.params.id) {
            return res.json(user);
        }
    })
   return res.status(404).json('not found');
})

app.post('/image', (req, res) => {
    const { id } = req.body;
    let found = false;

    db.users.forEach(user => {
        if (user.id === id) {
            found = true;
            user.entries++;
            return res.json(user.entries);
        }
    }) 
        if (!found) {
            res.status(404);
        }
})


app.listen(3001, () => {
    console.log('function fired on listen, port 3001')
});

/*
/profile/:userId --> GET
/image -> PUT
*/ 