const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const middleware = require('../utils/middleware');


blogRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user')
    response.json(blogs)

  })
  
  blogRouter.post('/', middleware.userExtractor, async (request, response) => {


    const body = request.body
    
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token invalid' })
    }
    const user = await User.findById(decodedToken.id)
      

    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes,
      user: user
    })
  
    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.status(201).json(savedBlog)
     
  })

  blogRouter.delete('/:id', middleware.userExtractor, async(request, response) => {

    // current request token
    // const decodedToken = jwt.verify(request.token, process.env.SECRET)
    // if (!decodedToken.id) {
    //   return response.status(401).json({ error: 'token invalid' })
    // }

    // fetch the blog in question because we need the user id
    const blog = await Blog.findById(request.params.id)


    // the fields contain objects so parse them to strings
    // compare the token id to the id who created the blog
    if(request.user.toString() === blog.user.toString()){
      await Blog.findByIdAndDelete(request.params.id)
      response.status(204).end()
    } else{
      response.status(400).json({ error: "unauthorized delete"})
    }

  })

  blogRouter.get('/:id', async (request, response) => {
    const blog = await Blog.findById(request.params.id).populate('user')
    if(blog){
      response.json(blog)
    } else{
      response.status(404).end()
    }
  })
  

  blogRouter.put('/:id', async(request, response) => {

    const likes = request.body.likes
    const id = request.params.id
    const blog = await Blog.findByIdAndUpdate(id, {likes: likes}, {new: true}).populate('user')
    response.json(blog)
  })

  module.exports = blogRouter