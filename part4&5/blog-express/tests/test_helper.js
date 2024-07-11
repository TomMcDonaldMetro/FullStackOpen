const User = require('../models/user')
const Blog = require('../models/blog')
const jwt = require('jsonwebtoken')

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
  }

  const usersInDb = async () => {
    const users = await User.find({})
    return users.map(user => user.toJSON())
  }

  const firstUser = async () => {
    const users = await usersInDb()
    return users[0]
  }

  const token = async () => {
    const user = await firstUser()

    const userForToken = {
      username: user.username,
      id: user.id,
    }
  
    // token expires in 60*60 seconds, that is, in one hour
    const token = jwt.sign(
      userForToken, 
      process.env.SECRET,
      { expiresIn: 60*60 }
    )

    console.log(token)
    return token
  }
  
  module.exports = {
    blogsInDb, usersInDb, token, firstUser
  }