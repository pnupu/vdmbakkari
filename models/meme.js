const mongoose = require('mongoose')

const memeSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    num: {
        type: Number,
        required: true
    },
    likes: Number,
})



memeSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        if(returnedObject.likes === undefined){
            returnedObject.likes = 0
        }
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Meme', memeSchema)