const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Post = new Schema({
    title: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    // Relacionando 2 documentos do mongo
    categorie: {
        // Armazenando o id de algum objeto
        type: Schema.Types.ObjectId,
        // Referenciando um model
        ref: 'categories',
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
    }
})

mongoose.model('posts', Post)