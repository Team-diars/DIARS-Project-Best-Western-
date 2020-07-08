const passport=require('passport');
const localstrategy=require('passport-local').Strategy;
const pool=require('../database');
const helpers=require('../lib/helpers');

passport.use('local.signin',new localstrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async(req,username,password,done)=>{
    const rows = await pool.query("SELECT `worker`.*, `role`.* FROM `worker` LEFT JOIN `role` ON `worker`.`role` = `role`.`role_id` WHERE `worker`.`username` = ? AND `worker`.`status` = '1'",[username]);
    if (rows.length > 0){
        const user = rows[0];
        if(user.password === password){
            return done(null, user, req.flash('success','Welcome '+user.username));
            
        }else{
            return done(null, false, req.flash('failure','Incorrect password'));
        }
    }
    else{
        return done(null, false, req.flash('failure','Username does not exist'));
    }
}));

passport.serializeUser((user,done)=>{
    done(null,user.worker_id);
}); 

passport.deserializeUser(async(id,done)=>{
    const rows = await pool.query("SELECT `worker`.*, `role`.* FROM `worker` LEFT JOIN `role` ON `worker`.`role` = `role`.`role_id` where worker_id=?",[id]);
    done(null,rows[0]);
})
