const express = require('express')
const router = express.Router()
const Salle = require('../models/salle')
const Bloc = require('../models/bloc')
const creneau = require('../models/creneau')


router.get('/', async(req,res) => {

    try{
        const salles = await creneau.find()
        res.json(salles)
    }catch(err){
        res.send('Error ' + err)
    }
})
router.post('/', async(req,res) => {
    try{
        creneau.create(req.body).then(function(creneau){
            res.send(creneau);
        });
    }catch(err){
        res.send('Error')
    }
})


router.delete('/:id',async(req,res)=> {
    try{
        const a1 = await creneau.findOneAndDelete(req.params.id)
        res.json(a1)
    }catch(err){
        res.send('Error')
    }

})
router.get('/:id', async(req,res) => {
    try{
        const bloc = await creneau.findById(req.params.id)
        res.json(bloc)
    }catch(err){
        res.send('Error ' + err)
    }
})
module.exports = router