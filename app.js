const express = require('express')
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const app = express()
const admin = require('./routes/admin')
const path = require('path')
const mongoose = require('mongoose')
const session = require('express-session')
const flash = require('connect-flash')

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
    console.log('conectado ao mongo');
}).catch((error) => {
    console.log('erro ao estabelecer conexõ com o mongo '+error)
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
    res.render('index')
})
app.get('/posts', (req, res) => {
    res.send('Postagens')
})
app.use('/admin', admin)

// Others
const PORT = 8080
app.listen(PORT, () => {
    console.log('Servidor rodandooo')
})