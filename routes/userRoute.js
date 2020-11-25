const express = require('express')
const bcrypt = require('bcryptjs')
const router = new express.Router()
const User = require('../models/User')

router.post('/register', async(req, res) => {
    const { name, email, password, confirmpass } = req.body

    if (!name || !email || !password || !confirmpass) {
        return res.status(500).json({ msg: "All fields are required."})
    }

    if ( password.length < 6) {
        return res.status(500).json({ msg: "Passwords must have greater than 6 characters."})
    }

    if ( password !== confirmpass) {
        return res.status(500).json({ msg: "Passwords must be the same."})
    }

    try {
        const user = await User.findOne({ email: email }).exec()
        
        if (user) {
            return res.status(500).json({ msg: "This email is already registered."})
        }
        const newUser = new User({
            name: name,
            email: email,
            password: password
        })
        //hash password
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
                if (err) throw err
                //set password to be hashed
                console.log("This is hash", hash)
                newUser.password = hash
                //save user
                newUser.save()
                    .then(user => {
                        res.status(200).json({ msg: "You are successfuly registered."})
                    })
                    .catch(err => {
                        res.status(500).json({ msg: "Database error."})
                    })
            })
        })

    } catch (err) {
        return res.status(500).json({ msg: err})
    }
})

router.post('/login', async (req, res) => {
    const { email, password } = req.body

    if(!email || !password) {
        return res.status(409).json({ msg: "All fields are required." })
    }
    try {
        const user = await User.findOne({ email: email }).exec()
        if(!user) {
            return res.status(409).json({ msg: "User not found" })
        }
        //Match password
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) throw err
            if (isMatch) {
                return res.status(200).json({ msg: "Login successful." })
            } else {
                return res.status(409).json({ msg: "Incorrect password." })
            }
        })
    } catch (err) {
        return res.status(500).json({ msg: "Network err." })
    }
})

router.put('/update', async(req, res) => {
    const { name, email, userId } = req.body
    if(!userId) {
        return res.status(500).json({ msg: "Please provide the userId."})
    }
    try {
        const user = await User.updateOne({ _id: userId }, {
            name: name,
            email: email            
        }, (err, result) => {
            if(err) {
                return res.status(500).json({ msg: "Database err." })
            }
            if(!result.n>0) {
                return res.status(500).json({ msg: "User isn't found." })
            }
        }).exec()
        return res.status(200).json({ msg: "User updated successfully." })
    } catch (err) {
        return res.status(500).json({ msg: err })
    }
})

router.delete('/delete', async(req, res) => {
    const { userId } = req.body

    if (!userId) {
        return res.status(409).json({ msg: "All fields are required."})
    }

    try {
        const user = await User.findOneAndRemove({ _id: userId }, (err, result) => {
            if(err) {
                res.status(500).json({ msg: "Database err." })
            }
            if(!result) {
                return res.status(409).json({ msg: "User not found." })
            }
            return res.status(200).json({ msg: "User deleted." })
        })
        console.log("This is user", user)
    } catch (err) {
        return res.status(500).json({ msg: "Network err." })
    }
})

module.exports = router