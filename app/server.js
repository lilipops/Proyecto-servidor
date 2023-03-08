var express = require('express')
var app = express()        
var bodyParser  = require('body-parser');       
const mongoose = require('mongoose');
const Register = require('../Models/register');
const Client = require('../Models/client')
const cors = require('cors');
const Coockies = require('../Models/coockies')
const Sescoock = require('../Models/sescoock')
const time = 7200000

app.use(cors({
    origin: '*'
}));
app.use(bodyParser.json());
mongoose.set('strictQuery', false)
mongoose.connect('mongodb+srv://nikita:cistQ131@cluster0.e4zwwjm.mongodb.net/consfiables', {
    useNewUrlParser: true, useUnifiedTopology: true
})
const connection = mongoose.connection
connection.on('error', console.log)
var port = process.env.PORT || 8080

app.get('/', function(req, res) {
  res.json({ mensaje: '¡Hola Mundo!' })   
})

app.post('/register', function(req, res) {
    // Falta comprobar tambien en la gente que ya esta aceptada
    Client.findOne({ email: req.body.email}).exec().then( function (event) {
        if(event == null) {
            Register.findOne({ email: req.body.email }).exec().then( function (e) {
                if(e == null) {
                    Register.create({ who: req.body.who , yourname: req.body.yourname, email: req.body.email, tlf: req.body.tlf, adress: req.body.adress, postalcode: req.body.postalcode, trabajos: req.body.postalcode})
                    // falta mandar un correo al administrador y al usuario
                    res.json({ status: 'OK'})
                } else {
                    res.json({ status: 'Error', code: "pendingUser"})
                } })
        } else {
            res.json({ status: 'Error', code: "registeredUser"})
        }
    })
})
function parseBigInt(str, base=10) {
    base = BigInt(base)
    var bigint = BigInt(0)
    for (var i = 0; i < str.length; i++) {
      var code = str[str.length-1-i].charCodeAt(0) - 48; if(code >= 10) code -= 39
      bigint += base**BigInt(i) * BigInt(code)
    }
    return bigint
}

function random128() {
    let res = []
    for(let i = 0;i < 128;i++) {
        res.push(Math.floor(Math.random() * 2))
    }
    res = res.join('')
    res = parseBigInt(res, 2)
    return res
} 
app.post('/login', function(req, res){
    Client.findOne({ email: req.body.email}).exec().then( function (event) {
        if(event != null && event.passwd == req.body.passwd) {
                
                let coockies = random128()
                let sescoock = random128()
         
                Coockies.create({  who: event.email,  coockies: coockies })
                Sescoock.create({  who: event.email,  sescoock: sescoock, time: Date.now() + time  })
                res.json({ status: 'OK', sescoock: event.email + ':' + sescoock , coockies: event.email + ':' + coockies})
        }  else {
            res.json({ status: 'Error'})
        }
    })
})

app.post('/coockie', function(req, res) {
    let coockies = req.body.coockies
    let sep = coockies.indexOf(':')
    let user = coockies.slice(0, sep)
    let num = coockies.slice(sep + 1, coockies.length)
    Coockies.findOne({ who: user, coockies: num}).exec().then( function (event) {
        if(event == null) {
            res.json({ status: 'Error'})
        } else {
            let coockie = random128() 
            let sescoock = random128()
            Coockies.findOneAndUpdate({ _id : event._id }, {who: user, coockies: coockie}).exec()
            Sescoock.create({  who: user,  sescoock: sescoock, time: Date.now() + time  })
            res.json({ status: 'OK', coockies: user + ':' + coockie, sescoock: user + ':' + sescoock })
        }
    })
})

app.post('/sescoockie', function(req, res) {

    let sescoockie = req.body.sescoockie
    let sep = sescoockie.indexOf(':')
    let user = sescoockie.slice(0, sep)
    let num = sescoockie.slice(sep + 1, sescoockie.length)
    console.log(sescoockie) 
    console.log(user)
    console.log(num)
    Sescoock.findOne({ who: user, sescoock: num}).exec().then( function (event) {
        if(event == null) {
            res.json({status: 'no sesion'})
        } else {
            let time = event.time
            if(Date.now() > time) {
                res.json({status: 'no sesion'})
            } else {
                res.json({ status: 'OK'})
            }
        }
    })
})

app.post('/googlelog', function(req, res) {
    let token = req.query.idtoken
    verify(token)
})

app.listen(port)

const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client('876367545259-a9iol2t9ooukjnkvvd8i2f58sc5ircpu.apps.googleusercontent.com');
async function verify(token) {
  const ticket = await client.verifyIdToken({
      idToken: token,
      audience: '876367545259-a9iol2t9ooukjnkvvd8i2f58sc5ircpu.apps.googleusercontent.com',  
  });
  const payload = ticket.getPayload();
  const userid = payload['sub'];
  console.log(ticket) 
  console.log(payload);
}