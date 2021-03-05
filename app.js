const express = require('express')
const handlebars = require('express')
const bodyParser = require('body-parser')
const app = express()
const admin = require('./routes/admin')

// Configs
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

app.engine('handlebars', handlebars({defaultlayout: 'main'}))
app.set('view engine', 'handlebars')

// Routes
app.use('/admin', admin)

// Others
const PORT = 8080
app.listen(PORT, () => {
    console.log('Servidor rodandooo')
})