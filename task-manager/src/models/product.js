// const express = require('express')
const mongoose = require('mongoose')
const validator = require('validator')

const userSchema = new mongoose.Schema({
    productName :{
        type : String,
        required : true
    },
    productCode:{
        type : Number,
        required :true,
        // validate(value) {
        //     if (validator(value) < 0) {
        //         throw new Error ('Product Code must be a Number')
        //     }
        // }
    },
    productPrice:{
        type : Number,
        required : true,
        // validate(value){
        //     if (validator(value) < 0) {
        //         throw new Error ('Product Price must be a Number')
        //     }
        // }
    },
    // createdBy:{
    //     type: String,
    //     required : true
    //     // ref :'Users'

    // },
    createdBy: {
        type: mongoose.Schema.Types.Object.name,
        required : true,
        ref:'Users'
    },

    updatedBy:{
        type:mongoose.Schema.Types.Object.name,
        ref:'Users'
    }
   
    
    
    
}, {
    timestamps: true
})


// userSchema.statics.findByCredentials = async(email,password) =>{
//     const product = await Product.findOne({email})
//     if (!product){
//         throw new Error('unable to login')
//     }
//     const isMatch = await bcrypt.compare(password, user.password)

//     if (!isMatch) {
//         throw new Error('Unable to Login')
//     }
//      return product
// }

// userSchema.pre('save', async function (next){
//     const product = this 
//     if (product.isModified('password')){
//         product.password = await bcrypt.hash(product.password, 8)
//     }
   

//     next()
// })

const Product = mongoose.model('Product', userSchema)
// const timestamp = new Date().getTime();
// const date1 = new Date().toLocaleString();
module.exports = Product