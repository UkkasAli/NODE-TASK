const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    email : {
        type : String,
        unique : true,
        required : true,
        trim : true,
        lowercase : true,
        validate(value) {
            if (!validator.isEmail(value)){
                throw new Error('Email is invalid')
            }
        }
    },
    name : {
        type : String,
        required :true

    },
    password : {
        type : String,
        required : true,
        minlength : 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')){
                throw new Error('Password cannot contain "password"')
            }
        }
    },
    tokens: [{
        token : {
            type : String,
            required : true
        }
    }]
})

userSchema.virtual('products', {
    ref : 'Product',
    localField: '_id',
    foreignField:'createdBy'
})

userSchema.methods.toJSON = function () {
    const user = this 
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens

    return userObject
}

userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString()}, 'thisismynewcourse')
    user.tokens = user.tokens.concat({ token })
    await user.save()
    return token
}


userSchema.statics.findByCredentails = async (email , password) => {
    const user = await Users.findOne({ email })

    if(!user) {
        throw new Error('Unable to Login')
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if(!isMatch) {
        throw new Error('Unable to Login')
    }
    return user
}

userSchema.pre('save' , async function (next) {
    const user = this
   if(user.isModified('password')){
    user.password = await bcrypt.hash(user.password, 8)
   }
   next()
})


const Users = mongoose.model('Users',userSchema)

module.exports = Users