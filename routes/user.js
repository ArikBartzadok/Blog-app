const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const passport = require('passport')
// Importando modelos
require('../models/User')
const User = mongoose.model('user')

router.get('/signup', (req, res) => {
    res.render('users/signup')
})

router.post('/signup', (req, res) => {
    var error = []

    if(!req.body.name || typeof req.body.name == undefined || req.body.name == null){
        error.push({text: 'Nome inválido'})
    }
    if(!req.body.email || typeof req.body.email == undefined || req.body.email == null){
        error.push({text: 'E-mail inválido'})
    }
    if(!req.body.password || typeof req.body.password == undefined || req.body.password == null){
        error.push({text: 'Senha inválida'})
    }
    if(req.body.password.lenght < 4){
        error.push({text: 'Senha muito curta'})
    }
    if(req.body.password != req.body.password2){
        error.push({text: 'As senhas são diferentes, tente novamente!'})
    }
    if(error.length > 0){
        res.render('users/signup', {error: error})
    }else{
        User.findOne({email: req.body.email}).then((user) => {
            if(user){
                req.flash('error_msg', 'Este e-mail já está cadastrado em nosso sistema.')
                res.redirect('/user/signup')
            }else{
                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password
                })
                bcrypt.genSalt(10, (error, salt) => {
                    bcrypt.hash(newUser.password, salt, (error, hash) => {
                        if(error){
                            console.log('>>> Erro interno ao gerar hash para senha :: '+error)
                            req.flash('error_msg', 'Ocorreu um erro ao cadastrar novo usuário.')
                            res.redirect('/')
                        }
                        newUser.password = hash
                        newUser.save().then(() => {
                            req.flash('success_msg', 'Usuário cadastrado com sucesso')
                            res.redirect('/')
                        }).catch((error) => {
                            console.log('>>> Erro interno ao cadastrar usuário no banco de dados :: '+error)
                            req.flash('error_msg', 'Ocorreu algum erro ao salvar usuário, tente novamente!')
                            res.redirect('/user/signup')
                        })
                    })
                })
            }
        })
    }
})

router.get('/login', (req, res) => {
    res.render('users/login')
})

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/user/login',
        failureFlash: true
    })(req, res, next)
})

router.get('/logout', (req, res) => {
    req.logout()
    req.flash('msg_success', 'Log out realizado com sucesso!')
    res.redirect('/')
})

module.exports = router