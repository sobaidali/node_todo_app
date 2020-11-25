const express = require('express')
const router = new express.Router()
//todo
const Todo = require('../models/Todo')
//user
const User = require('../models/User')

router.post('/create', async(req, res) => {
    const { title, content, userId } = req.body

    if (!title || !content || !userId) {
        return res.status(409).json({ msg: "All fields are required." })
    }
    try {
        const user = User.findById(userId, (err, doc) => {
            if(err) {
                return res.status(500).json({ msg: "Database err." })
            }
            if(!doc) {
                return res.status(409).json({ msg: "User not found." })
            }
            if(doc) {
                return doc
            }
        }).exec()

        if(user) {
            const newTodo = new Todo({
                title,
                content,
                userId
            })
            newTodo.save()
                .then( (doc) => {
                    res.status(200).json({ doc })
                })
                .catch(err => console.log(err))
        }
    } catch (err) {
        return res.status(500).json({ msg: "Network err." })
    }
})

router.get('/get', async(req, res) => {
    const { userId } = req.query

    if (!userId) {
        return res.status(409).json({ msg: "User id is required." })
    }
    try {
        const todo = await Todo.find({ userId }, (err, doc) => {
            if(err) throw err

            if (doc.length===0) {
                return res.status(400).json({ msg: "Todo isn't found." })
            }
            if (doc) {
                return doc
            }
        })
        return res.status(200).json({ todo })
    } catch (err) {
        return res.status(500).json({ msg: "Network err." })
    }
})

router.put('/update', async(req, res) => {
    const { title, content, todoId } = req.body

    if (!todoId) {
        return res.status(409).json({ msg: "All fields are required." })
    }
    try {
      const todo = await Todo.updateOne({ _id: todoId }, {
          title: title,
          content: content
      }, (err, doc) => {
          if (err) throw err

          if(doc.n===0) {
              return res.status(400).json({ msg: "Todo not found." })
          }
          return doc
      }).exec()
      return res.status(200).json({ msg: "Successfully updated." })
    } catch (err) {
        return res.status(500).json({ msg: "Network err." })
    }
})

router.delete('/delete', async(req, res) => {
    const { todoId } = req.body
    if(!todoId) {
        return res.status.json({ msg: "Todo id is required." })
    }
    try {
        const todo = await Todo.findOneAndRemove({ _id: todoId }, (err, doc) => {
            if(err) throw err

            if(!doc) {
                return null
            }
            if(doc) {
                return doc
            }
        }).exec()
        if (todo) {
            return res.status(200).json({ msg: "Todo deleted." })
        } else {
            return res.status(400).json({ msg: "Todo isn't found." })
        }
    } catch (err) {
        return res.status(500).json({ msg: "Network err." })
    }
})

module.exports = router