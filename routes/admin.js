const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    res.send('Pagina principal')
})

router.get('/posts', (req, res) => {
    res.send('Pagina de posts')
})

router.get('/categories', (req, res) => {
    res.send('Pagina de categorias')
})

module.exports = router