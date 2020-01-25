const express = require('express');
const router  = express.Router();
const mongoose = require('mongoose');
const Product = require('../models/product');

/*
router.get('/',(req,res,next)=>{
    res.status(200).json({
        message: 'GET requestss to /products'
    });
});

rout.post('/dodajRad',(req,res,next)=>{
  
    const product =  new Product({
        _id: new mongoose.Types.ObjectId(),
        naslov:req.body.naslov,
        podnaslov:req.body.podnaslov,
        slika:req.body.slika

    });
    product
    .save()
    .then(result=>{
        console.log(result);
    })
    .catch(err=>console.log(err));

    res.status(201).json({
        message: 'GET requestss to /products',
        createdProduct : product

    });
});
*/