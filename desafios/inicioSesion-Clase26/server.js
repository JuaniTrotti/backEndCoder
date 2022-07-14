const express = require('express');
const session = require('express-session')
const MongoStore = require('connect-mongo')
//connection mongodb
const mongoUrls = require('./connection/mongoConnection')
//constructor mongo & models
const mongoCon = require('./databases/constructor/userConstructor')
//encriptado pass
const bcrypt = require('bcrypt')
const saltRounds = 10

//api config
const app = express();
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//connect mongo users
const mongo = new mongoCon(mongoUrls.urlMongoUser)


//session start
const advancedOptions = { useNewUrlParser: true, useUnifiedTopology: true }
app.use(
    session({
        store: MongoStore.create({
            mongoUrl: mongoUrls.urlMongoSession,
            mongoOptions: advancedOptions,
            ttl: 6000,
        }),
      
        secret: 'obiwankenobi',
        resave: false,
        saveUninitialized: false,
    })
)
//session end

//ejs
app.use(express.static('./public'));
app.set('view engine', 'ejs');

//isAuth
app.use((req, res, next) => {
    req.isAuthenticated = () => {
        if (req.session.email) {
            req.session.visitas + 1
            return true
        }
        return false
    }
    req.logout = done => {
        req.session.destroy(done)
    }
    next()
})

//middlewares
function isAuth(req, res, next) {
    if (req.isAuthenticated()) {
        next()
    } else {
        res.redirect('/login')
    }
}

//endpoint
app.get('/', isAuth, (req, res) => {
    //main
    res.json('llegaste al main')
})

//register and middleware
app.get('/register', (req, res) => {
    if (req.isAuthenticated()) {
        res.redirect('/')
    }
    res.sendFile(__dirname + '/public/html/register.html')
})

async function emailExist(req, res, next) {
    if (await mongo.findUser(req.body.email)) {
        req.emailExist = true
    } else {
        req.emailExist = false
    }
    next()
}

async function registerUser(req, res, next) {
    if(!req.emailExist) {
        let hash = bcrypt.hashSync(req.body.password, saltRounds)
        let user = {
            name: req.body.user,
            email: req.body.email,
            password: hash
        }
        await mongo.newUser(user)
        next()
    } else {
        res.redirect('/error-email-exist')
    }
}

function createSession(req, res, next) {
    if(!req.session.email) {
        req.session.email = req.body.email
        req.session.visitas = 0
    }
    next()
}

app.post('/register', emailExist, registerUser, createSession, (req, res) => {
    res.redirect('/')
})

//login and middleware
app.get('/login', async (req, res) => {
    if (req.isAuthenticated()) {
        res.redirect('/')
    }
    await mongo.connectMongo();
    res.sendFile(__dirname + '/public/html/log.html')
})

async function manageLog(req, res, next) {
    if(!req.emailExist) {
        res.redirect('/error-email-not-exist')
    } else {
        const data = await mongo.getUser(req.body.email)
        if (bcrypt.compareSync(req.body.password, data.password)) {
            next()
        } else {
            res.redirect('/erros-password-wrong')
        }
    }
} 

app.post('/login', emailExist, manageLog, createSession, (req, res) => {
    res.redirect('/')
})

//olvidar 
app.get('/olvidar', (req, res) => {
    req.session.destroy( err => {
        if (err) {
          res.json({error: 'olvidar', descripcion: err})
        } else {
            res.redirect('/login')
        }
    })
})

const PORT = 8080
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
app.on('error', error => console.log(`Error en servidor ${error}`))
