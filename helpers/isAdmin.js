module.exports = {
    isAdmin: function(req, res, next){
        // ranking: {0: normal, 1:admin}
        if(req.isAuthenticated() && req.user.ranking == 1){
            return next()
        }
        req.flash('error_msg', 'Você precisa de autorização para entrar aqui!')
        res.redirect('/')
    }
}