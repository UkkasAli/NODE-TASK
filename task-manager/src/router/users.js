const express = require('express')
const Users = require('../models/users')
const auth = require('../middleware/auth')
const router = new express.Router()

router.post('/users', async (req ,res) => {
    const user = new Users(req.body)
    try{
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token})
    } catch (e) {
        res.status(400).send(e)
    }
})

router.post('/user/login' , async (req, res) => {
    try {
        const user = await Users.findByCredentails(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({user, token})
    } catch (e) {
        res.status(400).send()
    }
})

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/users/me', auth, async (req,res) => {
    res.send(req.user)
})



router.patch('/user/me',auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name','password']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid Updates!' })
    }
    try {
       
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()
         res.send(req.user)

    } catch (e) {
        res.status(400).send(e)
    }

})

router.delete('/user/me', auth, async (req, res) => {
    try{
        await req.user.remove()
        res.send(req.user)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router