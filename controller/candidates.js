const candidateRouter = require('express').Router()
const Candidate = require('../models/candidate')



candidateRouter.post('/', async (request, response ) => {
    const body = request.body
    const candidate = new Candidate({
        email: body.email,
        text: body.text,
        link: body.link,
    })
    const Savedcandidate = await candidate.save()
    response.json(Savedcandidate.toJSON())
})

candidateRouter.get('/', (req, res) => {
    Candidate.find({}, (err, items) => {
        if (err) {
            console.log(err);
            res.status(500).send('An error occurred', err);
        }
        else {
            res.json({ items: items });
        }
    });
});



module.exports = candidateRouter