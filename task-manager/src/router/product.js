const express = require('express')
const Product = require('../models/product')
const auth = require('../middleware/auth')
const router = new express.Router()

router.post('/creates', auth, async (req,res) =>{
    const product = new Product({
        ...req.body,
        createdBy : req.user.name
        
    })
 
    try{
     await product.save()
     res.status(201).send(product)
    } catch (e) {
     res.status(400).send(e)
    }
 
 //    product.save().then(()=> {
 //     res.send(product)
 //    }).catch((e) => {
 //     res.status(400).send(e)
     
 //    })
 })
router.post('/product/login', async (req,res) => {
    try {
        const user = await Product.findbyCredentials(req.body.email, req.body.password)
        res.send(user)
    } catch (e) {
        res.status(400).send()
    }
})


 
 router.get('/products', async (req,res) => {
     try{
         const products = await Product.find({})
         res.send(products)
     } catch (e) {
         res.status(500).send()
     }
 
     // Product.find({}).then((products) =>{
     //     res.send(products)
     // }).catch((e) => {
     //     res.status(500).send()
     // })
 })
 
 router.get('/product/:id', auth, async (req, res) => {
     const _id = req.params.id
 
     try {
         const product = await Product.findOne( { _id, createdBy : req.user._id } )
         if(!product) {
             return res.status(404).send()
         }
 
         res.send(product)
     } catch (e) {
         res.status(500).send()
     }
 
     
 
     // Product.findById(_id).then((product) => {
     //     if(!product) {
        // "email" : "bharathi@doodleblue.com",
        // "password" : "bharathi123"
     //         return res.status(404).send()
     //     }
 
     //     res.send(product)
     // }).catch((e) => {
     //     res.status(500).send()
     // })
 })
 
 router.patch('/product/:id',auth, async (req,res) => {
     const updates = Object.keys(req.body)
     const allowedUpdates = ['productCode','productPrice']
     const isValidOperation = updates.every((update)=> allowedUpdates.includes(update))
    //  const product1 = new Product({
    //     ...req.body,
    //     updatedBy : req.user.name
        
    // })
 
     if(!isValidOperation) {
         return res.status(400).send({ error : "Invalid updateds!"})
     }
 
     try {
            const product = await Product.findById(req.params.id)
            updates.forEach((update) => product [update] = req.body [update])
            await product.save()
        //  const product = await Product.findByIdAndUpdate(req.params.id,req.body, { new:true, runValidators:true})
         
         if(!product){
             return res.status(404).send()
         }
         res.send(product)
     } catch (e) {
         res.status(400).send(e)
     }
 })
 
 router.delete('/delete/:id' , async(req, res) => {
     
  try {
     const product = await Product.findByIdAndDelete(req.params.id)
     if(!product){
         return res.status(404).send({error : 'The Product is already Delete or Not Created'})
     }
     res.send(product)
     
  } catch (e) {
     res.status(500).send()
  }
 })
 

module.exports = router