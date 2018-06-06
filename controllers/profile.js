const handleProfileGet = (req, res, db) => {
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
}

module.exports = {
    handleProfileGet: handleProfileGet
}