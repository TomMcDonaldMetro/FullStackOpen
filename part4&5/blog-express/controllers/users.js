const bcrypt = require('bcryptjs')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs')

  response.json(users)
})

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  if(password.length < 3){
    console.log("error in password")
    console.log(password)
    console.log(password.length)
    response.status(400).json({"error": "invalid username or password"})
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hashSync(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash,
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
})

module.exports = usersRouter