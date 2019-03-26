const mongoose = require('mongoose')
const express = require('express')
const router = express.Router()
const Joi = require('joi')

const ToDoList = mongoose.model('ToDoList', new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 250
    },
    status: {
        type: Boolean,
        default: false
    },
    date: {
        type: Date,
        default: Date.now
    }
}))

// router.get('/', (req, res) => {
//     res.send('<br/> <h2 style="text-align:center; font-family:Roboto;"> To Do List ( nodejs express REST API) </h2> ')
// })

router.get('/', async (req, res) => {
    const todoitems = await ToDoList.find().sort('-date')
    res.send(todoitems)
})

router.post('/', async (req, res) => {
    const {error} = validateTodoitem(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    let todoitem = new ToDoList({ name: req.body.name, status: req.body.status })
    todoitem = await todoitem.save()
    
    res.send(todoitem)
})

router.put('/:id', async (req, res) => {
    const { error } = validateTodoitem(req.body)
    if (error) return res.send(400).send(error.details[0].message)

    const todoitem = await ToDoList.findByIdAndUpdate( req.params.id, { name: req.body.name, status: req.body.status }, { new: true })

    if (!todoitem) return res.status(404).send('TodoItem not found')
    
    res.send(todoitem)
})

router.delete('/:id', async (req, res) => {
    const todoitem = await ToDoList.findByIdAndRemove(req.params.id)    

    if (!todoitem) return res.status(404).send('TodoItem not found')    

    res.send(todoitem)    
})

router.get('/:id', async (req, res) => {
    const todoitem = await ToDoList.findById(req.params.id)
    
    if (!todoitem) return res.status(404).send('TodoItem not found')

    res.send(todoitem)
})

function validateTodoitem(todoitem) {
    const schema = {
        name: Joi.string().min(3).required(),
        status: Joi.boolean().default(false)
    }    
    return Joi.validate(todoitem, schema)}

module.exports = router;