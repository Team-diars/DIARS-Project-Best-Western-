const passport=require('passport');
const localstrategy=require('passport-local').Strategy;
const pool=require('../database');
const helpers=require('../lib/helpers');

passport.use('local.signin',new localstrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async(req,username,password,done)=>{
    const rows = await pool.query("select * from worker where username = ? and account=1",[username]);
    if (rows.length > 0){
        const user = rows[0];
        if(user.password === password){
            return done(null, user, req.flash('success','Welcome '+user.username));
            
        }else{
            return done(null, false, req.flash('message','Incorrect password'));
        }
    }
    else{
        return done(null, false, req.flash('message','Username does not exist'));
    }
}));

passport.serializeUser((user,done)=>{
    done(null,user.worker_id);
}); 

passport.deserializeUser(async(id,done)=>{
    const rows = await pool.query('select * from worker where worker_id=?',[id]);
    done(null,rows[0]);
})
