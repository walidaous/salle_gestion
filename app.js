const express = require('express')
const mongoose = require('mongoose')
const url = 'mongodb+srv://walid:M624635@cluster0.wid6g.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
const app = express()
const WebSocket = require('ws')
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', function connection(ws) {
    //console.log('A new client Connected!');
    //ws.send('Welcome New Client!');

    ws.on('message', function incoming(message) {
        //console.log('received: %s', message);
        wss.clients.forEach(function each(client) {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });

    });
});
mongoose.connect(url, {useNewUrlParser:true})
const con = mongoose.connection

con.on('open', () => {
    console.log('connected...')
})
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8888');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});
app.use(express.json())
const cors = require('cors');
app.use(cors());

const blocRouter = require('./routes/blocs')
app.use('/blocs',blocRouter)
const salleRouter = require('./routes/salles')
app.use('/salles',salleRouter)
const creaneauRouter = require('./routes/creneau')
app.use('/creneau',creaneauRouter)
const occupationRouter = require('./routes/occupation')
app.use('/occupation',occupationRouter)

app.listen(process.env.PORT || 3000, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});