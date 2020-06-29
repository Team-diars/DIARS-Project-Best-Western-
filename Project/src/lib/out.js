module.exports={
    isnotlogedin(req,res,next){
        if(req.isAuthenticated()){
            return next();
        }
        return res.redirect('/signin'); //si no esta logeado redirecciona a signin
    },
    
    islogedin(req,res,next){
        if(!req.isAuthenticated()){
            return next();
        }
        return res.redirect('/home'); //si esta logeado redirecciona a home
    }
};