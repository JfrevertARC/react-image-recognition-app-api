const Clarifai = require('clarifai')


const app = new Clarifai.App({apiKey: 'c7ee2ced04e1461fb647ff892460202c'});
const handleApiCall = (req, res) => {
    app.models.predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
    .then(data => {
        res.json(data)
    }).catch(err => res.status(400).json(err))
}

const handleImageGet = (req, res, db) => {
    const { id } = req.body;

    db('users').where("id", "=", id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
       res.json(entries[0])
    }).catch(err => res.status(400).json('Failed to retrieve user.'))
}

module.exports = {
    handleImageGet: handleImageGet,
    handleApiCall: handleApiCall
}