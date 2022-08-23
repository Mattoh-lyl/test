const express = require('express')
const { AddUser, FindAllUsers, FindSingleUser, UpdateUser, DeleteUser } = require('../controllers/user.controller')
const router = express.Router()

// add user
router.post('/users', AddUser)

// find all user
router.get('/users', FindAllUsers)

// find sngle user
router.get('/users/:id',FindSingleUser)

// update user
router.put('/users/:id', UpdateUser)

// delete user
router.delete('/users/:id', DeleteUser)

module.exports = router;