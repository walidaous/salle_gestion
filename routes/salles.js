const express = require('express')
const router = express.Router()
const Salle = require('../models/salle')
const Bloc = require('../models/bloc')
router.get('/',function(req,res,next){
    Salle.find({}).populate('bloc',).sort( { _id: 1 } ).then(function(salle){
        res.send(salle);
    }).catch(next);
});
router.post('/', async(req,res) => {

    Bloc.findById(req.body.bloc._id).then(function(bloc){
        if(bloc != null){
            Salle.create(req.body).then(function(salle){
                res.send(salle);
            });
        }else {
            res.json({
                "erreur":"Bloc n'est pas disponible"
            }) 
        }
    })

})

router.delete('/:id',async(req,res)=> {
    try{
        const a1 = await Salle.findOneAndDelete(req.params.id)
        res.json(a1)   
    }catch(err){
        res.send('Error')
    }

})
router.get('/:id', async(req,res) => {
    try{
        const bloc = await Salle.findById(req.params.id)
        res.json(bloc)
    }catch(err){
        res.send('Error ' + err)
    }
})
module.exports = router