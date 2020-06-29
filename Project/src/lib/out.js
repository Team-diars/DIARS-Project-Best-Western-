module.exports={
    isnotlogedin(req,res,next){
        if(req.isAuthenticated()){
            return next();
        }
        return res.redirect('/signin');
    },
    
    islogedin(req,res,next){
        if(!req.isAuthenticated()){
            return next();
        }
        return res.redirect('/');
    }
};