const express = require('express')
require('./db/mongoose')
// const Product = require('./models/product')
const productRouter = require('./router/product')
const app = express()
// const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const userRouter = require('./router/users')
const port = process.env.PORT || 3000 

// app.use((req, res, next) => {
//     if (req.method === 'GET') {
//         res.send('GET resquests are disabled')
//     } else {
//         next ()
//     }
// })

// app.use((req, res, next) => {
//     res.status(503).send('Site is currently down. Check back soon!')
// })


app.use(express.json())
app.use(productRouter)
app.use(userRouter)

const myFunction = async () => {
    const token = jwt.sign({_id :'chan123'},'thisismynewcourse', { expiresIn : '7 days'})
    console.log(token);
    
    const data = jwt.verify(token,'thisismynewcourse')
    console.log(data);
}

myFunction()

app.listen(port,()=>{
    console.log('server is up on Port ' +  port );
})


// const Product = require('./models/product')
// const Users = require ('./models/users')

// const main = async () => {
// //     const product = await Product.findById('6333452fb1ad81b5120c7313')
// //   const pop = await product.populate('createdBy').execPopulate()
// //     console.log(pop);
// const user = await Users.findById('63334159cee1087453ba75ff')
// await user.populate('products')
// console.log(user.products);
// }

// main()