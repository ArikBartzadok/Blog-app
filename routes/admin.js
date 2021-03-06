const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')

// Importando os modelos
require('../models/Categorie')
const Categories = mongoose.model('categories')

router.get('/', (req, res) => {
    res.render('admin/index')
})

router.get('/posts', (req, res) => {
    res.send('Pagina de posts')
})

router.get('/categories', (req, res) => {
    Categories.find().sort({date: 'DESC'}).then((categories) => {
        res.render('admin/categories', {categories: categories.map(categories => categories.toJSON())})
    }).catch((error) => {
        console.log('>>> Erro ao realizar listagem de categorias :: '+error);
        req.flash('error_msg', 'Ocorreu algum erro ao realizar a listagem de categorias')
        res.rendirect('/admin')
    })
})

router.get('/categories/add', (req, res) => {
    res.render('admin/categoriesAdd')
})

router.post('/categories/new', (req, res) => {
    // Validando formulário
    var errors = []
    if(!req.body.name || typeof req.body.name == undefined || req.body.name == null){
        errors.push({text: 'Nome inválido'})
    }
    if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
        errors.push({text: 'Nome da categoria é inválido'})
    }
    if(errors.length > 0){
        // ou redirect
        res.render('admin/categoriesAdd', {errors: errors})
    }else{
        const newCategorie = {
            name: req.body.name,
            slug: req.body.slug
        }
    
        new Categories(newCategorie).save().then(() => {
            req.flash('success_msg', 'Categoria cadastrada com sucesso"')
            res.redirect('/admin/categories')
        }).catch((error) => {
            console.log('>>> Erro ao relizar cadastro de categoria :: '+error)
            req.flash('error_msg', 'Ocorreu um erro ao cadastrar categoria, tente novamente!')
            res.redirect('/admin')
        })
    }
})

module.exports = router