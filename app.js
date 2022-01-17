const express = require('express')
const mongoose = require('mongoose')
const url = 'mongodb+srv://walid:M624635@cluster0.wid6g.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
const app = express()

mongoose.connect(url, {useNewUrlParser:true})
const con = mongoose.connection

con.on('open', () => {
    console.log('connected...')
})


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