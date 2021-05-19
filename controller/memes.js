const memeRouter = require('express').Router()
const Meme = require('../models/meme')



memeRouter.get('/', async (request, response) => {
    const memes = await Meme.find({}).populate('user')
    response.json(memes.map(meme => meme.toJSON()))
})

memeRouter.post('/', async (request, response ) => {
    const body = request.body


    const meme = new Meme({
        title: body.title,
        num: body.num,
        likes: body.likes,
    })
    const savedMeme = await meme.save()
    response.json(savedMeme.toJSON())
})

memeRouter.put('/:id', async (request, response) => {
    const body = request.body
    const meme = {
        title: body.title,
        num: body.num,
        likes: body.likes === undefined ? 0 : body.likes,    }

    const updatedMeme = await Meme.findByIdAndUpdate(request.params.id, meme,  { new: true })
    response.json(updatedMeme.toJSON())
})

module.exports = memeRouter