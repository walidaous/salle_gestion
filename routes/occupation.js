const express = require('express')
const router = express.Router()
const Salle = require('../models/salle')
const occupation = require('../models/occupation')
const creneau = require('../models/creneau')
const WebSocket = require('ws');
const Bloc = require("../models/bloc");


router.get('/',function(req,res,next){
    occupation.find({}).populate('salle',).populate('creneau').then(function(salle){
        res.send(salle);

    }).catch(next);
});
router.get('/salle/:id',async function (req, res, next) {


    const salles = await creneau.find({"label":req.params.id})
    occupation.find({"creneau":salles,"date":  {
            $gte:   new Date(new Date().setHours(0,0,0)) ,
            $lt :  new Date(new Date().setHours(23,59,59))
        }    }).populate('salle').then(function (salle) {
        res.send(salle);
    }).catch(next);
});
router.get('/test',async function (req, res, next) {


    occupation.find().populate('salle').distinct('salle').then(function (salle) {
        res.send(salle);
    }).catch(next);
});
router.get('/salle2/:id',async function (req, res, next) {

    const salles = await creneau.find({"label":req.params.id})
    occupation.find({"creneau":salles,"date":  {
            $gte:   new Date(new Date().setHours(0,0,0)) ,
            $lt :  new Date(new Date().setHours(23,59,59))
        }    }).distinct('salle').then(function (salle) {
            Salle.find(
                {
                    "_id" : { '$nin': salle
                    }
                }
            ).then(function (salle2) {Salle.find({"_id":salle2}).then(function (a) {
                res.send(a);

            });})
    }).catch(next);
});
router.get('/salles/a',async function (req, res, next) {
   occupation.aggregate( [{
       $group: {
           _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
           count: { $sum: 1 }
       }

   }]).sort( { _id: 1 } ).then(function (salle) {
        res.send(salle);
    }).catch(next);

});
router.get('/salles/b',async function (req, res, next) {
    occupation.aggregate( [{
        $group: {
            _id: "$salle",
            count: { $sum: 1 },

        }

    },
    ]).sort( { _id: 1 } ).then(function (salle) {
            res.send(salle);
    }).catch(next);

});
router.get('/salleparbloc/:id',async function (req, res, next) {
    Salle.find({"bloc":req.params.id}).then(function (salle) {
       res.send(salle);
    });

});
router.get('/a2/salleparbloc2/:id',async function (req, res, next) {
    Salle.find({"bloc":req.params.id}).populate("salle").then(function (salle) {
        occupation.find({"creneau":'61c8c0a3d43fff36a92317ca',
            "salle": salle, "date": {
                $gte: new Date(new Date().setHours(0, 0, 0)),
                $lt: new Date(new Date().setHours(23, 59, 59))
            }
        }).populate("salle").then(function (salle) {
            res.send(salle);
        }).catch(next);
    });

});
/*
router.get('/', async(req,res) => {
    try{
        const salles = await occupation.find()
        res.json(salles)
    }catch(err){
        res.send('Error ' + err)
    }
})
*/
router.post('/', async(req,res) => {

    occupation.find({"salle":req.body.salle._id,"creneau":req.body.creneau._id,"date":req.body.date}).then(
        function (rep2) {
            if (rep2.length==0){
                Salle.findById(req.body.salle._id).then(function(salle){
                    creneau.findById(req.body.creneau._id).then(function(creneau){

                        if(salle != null && creneau!= null){
                            occupation.create(req.body).then(function(occupation){
                                res.json({
                                    "rep":"ok"
                                })
                            });
                        }else {
                            res.json({
                                "erreur":"Bloc n'est pas disponible"
                            })
                        }
                    })
                })
            }else{
                res.json({
                    "rep":rep2[0].id
                })
            }


        }
    )

});
router.delete('/:id',async(req,res)=> {
    try{
        const a1 = await occupation.findOneAndDelete({"_id":req.params.id})
        res.json(a1)
    }catch(err){
        res.send('Error')
    }

});
router.get('/:id', async(req,res) => {
    occupation.findById(req.params.id).populate('salle',).populate('creneau').then(function(salle){
        res.send(salle);
    });
});
module.exports = router