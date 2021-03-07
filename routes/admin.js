const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')

// Importando os modelos
require('../models/Categorie')
const Categories = mongoose.model('categories')
require('../models/Post')
const Post = mongoose.model('posts')

router.get('/', (req, res) => {
    res.render('admin/index')
})

router.get('/categories', (req, res) => {
    Categories.find().sort({date: 'DESC'}).then((categories) => {
        res.render('admin/categories', {categories: categories.map(categories => categories.toJSON())})
    }).catch((error) => {
        console.log('>>> Erro ao realizar listagem de categorias :: '+error);
        req.flash('error_msg', 'Ocorreu algum erro ao realizar a listagem de categorias')
        res.rendirect('admin')
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
            res.redirect('admin')
        })
    }
})

router.get('/categories/edit/:id', (req, res) => {
    Categories.findOne({_id: req.params.id}).lean().then((categorie) => {
        res.render('admin/categoriesEdit', {categorie: categorie})
    }).catch((error) => {
        console.log('>>> Erro ao carregar categoria para edição :: '+error)
        req.flash('error_msg', 'Esta categoria não existe')
        res.redirect('/admin/categories')
    })
})

router.post('/categories/edit', (req, res) => {
    Categories.findOne({_id: req.body.id}).then((categorie) => {
        categorie.name = req.body.name
        categorie.slug = req.body.slug

        categorie.save().then(() => {
            req.flash('success_msg', 'Categoria editada com sucesso!')
            res.redirect('/admin/categories')
        }).catch((error) => {
            console.log('>>> Erro ao relizar edição de categoria :: '+error)
            req.flash('error_msg', 'Ocorreu algum erro interno ao salvar sua edição.')
            res.redirect('/admin/categories')
        })

    }).catch((error) => {
        console.log('>>> Erro interno ao relizar edição de categoria :: '+error)
        req.flash('error_msg','Não possível encontar o registro da categoria no banco de dados.')
        res.redirect('/admin/categories')
    })
})

router.get('/categories/delete/:id', (req, res) => {
    Categories.findOneAndDelete({_id: req.params.id}).then(() => {
        req.flash('success_msg', 'Categoria deletada com sucesso!')
        res.redirect('/admin/categories')
    }).catch((error) => {
        console.log('>>> Erro ao deletar categoria :: '+error)
        req.flash('error_msg', 'Erro ao deletar categoria.')
        res.redirect('/admin/categories')
    })
})

router.get('/posts', (req, res) => {
    Post.find().sort({data: 'DESC'}).lean().populate('categorie').then((posts) => {
        res.render('admin/posts', {posts: posts})
    }).catch((error) => {
        console.log('>>> Erro interno ao carregar publicações :: '+error)
        req.flash('error_msg', 'Ocorreu algum erro ao realizar a listegm das publicações')
        res.redirect('/admin')
    })
})

router.get('/posts/add', (req, res) => {
    Categories.find().then((categories) => {
        res.render('admin/postsAdd', {categories: categories.map(categories => categories.toJSON())})
    }).catch((error) => {
        console.log('>>> Erro interno ao carregar formulário para cadastro de publicação :: '+error)
        req.flash('error_msg', 'Ocorreu algum erro ao carregar o formulário de postagens')
        res.redirect('/admin')
    })
})

router.post('/posts/new', (req, res) => {
    var error = []

    console.log(req.body);

    if(req.body.categorie == '0'){
        error.push({text: 'Categoria inválida, registre uma categoria'})
    }

    if(error.length > 0){
        res.render('admin/postsAdd', {error: error})
    }else{
        const newPost = {
            title: req.body.title,
            description: req.body.description,
            content: req.body.content,
            categorie: req.body.categorie,
            slug: req.body.slug
        }

        new Post(newPost).save().then(() => {
            req.flash('success_msg', 'Postagem criada com sucesso')
            res.redirect('/admin/posts')
        }).catch((error) => {
            console.log('>>> Erro interno ao relizar cadastro de publicação :: '+error)
            req.flash('error_msg', 'Ocorreu algum erro ao salvar a postagem')
            res.redirect('/admin/posts')
        })
    }
})

router.get('/posts/edit/:id', (req, res) => {
    Post.findOne({_id: req.params.id}).lean().then((post) => {
        Categories.find().lean().then((categories) => {
            res.render('admin/postsEdit', {categories: categories, post: post})
        }).catch((error) => {
            console.log('>>> Erro interno ao listar categorias :: '+error)
            req.flash('error_msg', 'Ocorreu algum erro ao listar as categorias.')
        })
    }).catch((error) => {
        console.log('>>> Erro interno ao carregar publicações :: '+error)
        req.flash('error_msg', 'Ocorreu algum erro ao carregar o formulário de edição.')
    })
})

router.post('/posts/edit', (req, res) => {
    Post.findOne({_id: req.body.id}).then((post) => {

        post.title = req.body.title
        post.slug = req.body.slug
        post.description = req.body.description
        post.content = req.body.content
        post.categorie = req.body.categorie

        post.save().then(() => {
            req.flash('success_msg', 'Postagem editada com sucesso!')
            res.redirect('/admin/posts')
        }).catch((error) => {
            console.log('>>> Erro interno ao salvar edição da publicação :: '+error)
            req.flash('error_msg', 'Ocorreu algum erro ao salvar a edição da publicação.')
            res.redirect('/admin/posts')
        })
    }).catch((error) => {
        console.log('>>> Erro interno ao carregar publicação para edição :: '+error)
        req.flash('error_msg', 'Ocorreu algum erro ao salvar a edição da publicação.')
        res.redirect('/admin/posts')
    })
})

router.get('/posts/delete/:id', (req, res) => {
    Post.findOneAndDelete({_id: req.params.id}).then(() => {
        req.flash('success_msg', 'Publicação deletada com sucesso!')
        res.redirect('/admin/posts')
    }).catch((error) => {
        console.log('>>> Erro ao deletar publicação :: '+error)
        req.flash('error_msg', 'Erro ao deletar publicação.')
        res.redirect('/admin/posts')
    })
})

module.exports = router