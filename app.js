const express = require('express')
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const app = express()
const path = require('path')
const mongoose = require('mongoose')
const session = require('express-session')
const flash = require('connect-flash')

// Importando rotas
const admin = require('./routes/admin')
const user = require('./routes/user')

// Carregando models
require('./models/Post')
const Post = mongoose.model('posts')
require('./models/Categorie')
const Categorie = mongoose.model('categories')

// Configs
// Sessions
app.use(session({
    secret: 'blogapp',
    resave: true,
    saveUnitialized: true
}))
app.use(flash())

// Config middleware
app.use((req, res, next) => {
    // Globals vars
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    next()
})

// Body parser
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

// Handlebars
app.engine('handlebars', handlebars({defaultlayout: 'main'}))
app.set('view engine', '.handlebars')

// Mongoose
mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost/blogapp').then(() => {
    console.log('>>> Conectado ao mongo :)');
}).catch((error) => {
    console.log('>>> Erro  ao estabelecer conexõ com o mongo :: '+error)
})

// Public static files
app.use(express.static(path.join(__dirname,'public')))

// Middleware
app.use((req, res, next) => {
    console.log('middleware')
    next()
})

// Routes
app.get('/', (req, res) => {
    Post.find().lean().populate('categorie').sort({data: 'DESC'}).then((posts) => {
        res.render('index', {posts: posts})
    }).catch((error) => {
        console.log('>>> Erro interno ao listar publicações :: '+error)
        req.flash('error_msg', 'Ocorreu algum erro interno durante a listagem das publicações.')
        req.redirect('/404')
    })
})

app.get('/post/:slug', (req, res) => {
    Post.findOne({slug: req.params.slug}).lean().then((post) => {
        if(post){
            res.render('post/index', {post: post})
        }else{
            req.flash('error_msg', 'Esta postagem não existe!')
            res.redirect('/')
        }
    }).catch((error) => {
        console.log('>>> Erro interno ao listar publicação :: '+error)
        req.flash('error_msg', 'Ocorreu algum erro interno ao listar publicação.')
        res.redirect('/')
    })
})

app.get('/categories', (req, res) => {
    Categorie.find().lean().then((categories) => {
        res.render('categories/index', {categories: categories})
    }).catch((error) => {
        console.log('>>> Erro interno ao listar categorias :: '+error)
        req.flash('error_msg', 'Ocorreu algum erro interno ao buscar as categorias.')
        res.redirect('/')
    })
})

app.get('/categories/:slug', (req, res) => {
    Categorie.findOne({slug: req.params.slug}).lean().then((categorie) => {
        if(categorie){
            Post.find({categorie: categorie._id}).lean().then((posts) => {
                res.render('categories/posts', {posts: posts, categorie: categorie})
            }).catch((error) => {
                console.log('>>> Erro interno ao listar publicações :: '+error)
                req.flash('error_msg', 'Ocorreu um erro ao listar as publicações desta categoria.')
                res.redirect('/')
            })
        }else{
            req.flash('error_msg', 'Esta categoria não existe.')
            res.redirect('/categories')
        }
    }).catch((error) => {
        console.log('>>> Erro interno ao listar categoria :: '+error)
        req.flash('error_msg', 'Ocorreu um erro interno ao listar a página desta categoria.')
        res.redirect('/')
    })
})

app.get('/404', (req, res) => {
    res.send('Ops... página não encontrada!')
})

app.use('/admin', admin)
app.use('/user', user)

// Others
const PORT = 8080
app.listen(PORT, () => {
    console.log(`>>> Servidor rodando --port ${PORT}`)
})