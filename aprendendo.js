const mongoose = require('mongoose')

// Configurando o mongoose
mongoose.Promise = global.Promise

mongoose.connect('mongodb://localhost/learning', {
    useMongoClient: true
}).then(() => {
    console.log('sucesso');
}).catch((error) => {
    console.log('erro ao conectar: ' + error)
})

// Model - usuarios
const UserScheema = mongoose.Schema({
    nome: {
        type: String,
        require: true
    },
    sobrenome: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    idade: {
        type: Number,
        require: true
    },
    pais: {
        type: String
    }
})
// Collection
const Diogo = mongoose.model('User', UserScheema)

new Diogo({
    nome: 'Diogo',
    sobrenome: 'Teste',
    email: 'teste@teste.com',
    idade: 17,
    pais: 'BR'
}).save().then(() => {
    console.log('usuario cadastrado com sucesso');
}).catch(() => {
    console.log('Erro ao cadastrar usuario');
})