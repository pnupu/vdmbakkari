const mongoose = require('mongoose')

/**
const candidateSchema = mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    img:
    {
        data: Buffer,
        contentType: String
    } 
})

 */
const candidateSchema = mongoose.Schema({
    img:
    {
        data: Buffer,
        contentType: String
    } 
})

candidateSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Candidate', candidateSchema)