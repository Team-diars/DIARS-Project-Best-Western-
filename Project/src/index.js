const express=require('express');
const morgan=require('morgan');
const exphbs=require('express-handlebars');
const path=require('path');
const flash=require('connect-flash');
const session=require('express-session');
const mysqlstore= require('express-mysql-session');
const passport=require('passport');
const {database}=require('./key');
const puppeteer=require('puppeteer');
const fs=require('fs');
const { allowedNodeEnvironmentFlags } = require('process');

//Initializations
const app=express();
require('./lib/passport');

//Settings
app.set('port',process.env.PORT||4000);
app.set('view engine','.hbs');
app.set('views',path.join(__dirname,'views'))
app.engine('.hbs',exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'),'layouts'),
    partialsDir: path.join(app.get('views'),'partials'),
    extname: '.hbs',
    helpers: require('./lib/helpers')
}));
//*Other 'main' layout for index webpage
app.set('view options',{layout:'index'})

//Middlewares
app.use(session({
    secret: '343ji43j4n3jn4jk3n',
    resave: false,
    saveUninitialized: false,
    store: new mysqlstore(database)
}));
app.use(flash());
app.use(morgan('dev'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

//Global variables
app.use((req, res, next)=>{
    app.locals.success=req.flash('success');
    app.locals.success_delete=req.flash('success_delete');
    app.locals.failure=req.flash('failure');
    app.locals.user = req.user;
    next();
});

//Routes
app.use(require('./routes/index'));
app.use('/worker',require('./routes/worker'));
app.use('/room',require('./routes/room'));
app.use('/roomtype',require('./routes/roomtype'));
app.use('/jobposition',require('./routes/jobposition'));
app.use('/producttype',require('./routes/producttype'));
app.use('/product',require('./routes/product'));
app.use('/setting',require('./routes/setting'));
app.use('/purchase-order',require('./routes/purchase-order'));
app.use('/inv-receipt',require('./routes/inv-receipt'));
app.use('/inv-issue',require('./routes/inv-issue'));
app.use('/role',require('./routes/role'));
app.use('/users',require('./routes/users'));
app.use('/guest',require('./routes/guest'));
app.use('/booked-room',require('./routes/booked-room'));
app.use('/reservation',require('./routes/reservation'));
app.use(require('./routes/auth'))
app.use(require('./routes/home'))


//Public
app.use(express.static(path.join(__dirname,'public')));

//Starting the server
app.listen(app.get('port'),()=>{
    console.log('Server on port',app.get('port'));
});