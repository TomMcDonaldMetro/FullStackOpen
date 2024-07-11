const { test, after, beforeEach } = require('node:test')
const Blog = require('../models/blog')
const User = require('../models/user')

const helper = require('./test_helper')
const jwt = require('jsonwebtoken')

const assert = require('node:assert')
const mongoose = require('mongoose')
 
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

const initialBlogs = [
        {
          _id: "5a422a851b54a676234d17f7",
          title: "React patterns",
          author: "Michael Chan",
          url: "https://reactpatterns.com/",
          likes: 7,
          __v: 0
        },
        {
          _id: "5a422aa71b54a676234d17f8",
          title: "Go To Statement Considered Harmful",
          author: "Edsger W. Dijkstra",
          url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
          likes: 5,
          __v: 0
        }
]

// init db resources before each test
beforeEach(async () => {

    await User.deleteMany({})

    const newUser = {
        username: 'mluukkai',
        name: 'Matti Luukkainen',
        password: 'salainen',
      }
  
      await api
        .post('/api/users')
        .send(newUser)

    await Blog.deleteMany({})

    for (let blog of initialBlogs) {
        let blogObject = new Blog(blog)
        await blogObject.save()
    }
})

test('check if returning json', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('check if returning all blogs', async () => {
    
    const response = await api.get('/api/blogs')
    assert(response.body.length === initialBlogs.length)
})

// the mongodb database by default names id "_id"
// in order to change this we need to edit the model returned in models
test('id variable is the correct spelling', async () => {
    const response = await api.get('/api/blogs')
    
    const blogs = response.body
    const blog = blogs[0]
    assert(Object.getOwnPropertyNames(blog).includes("id"))
})

test('blog is successfully stored to the database', async () => {

    const user = await helper.firstUser()
    const token = await helper.token()

    const newBlog = {
        title: "The ever changing degree",
        author: "Wiki Jones",
        url: "Wikipeek.com",
        user: user.id,
        likes: 1
    }

    await api.post('/api/blogs')
        .send(newBlog)
        .set({ 'Authorization' : "Bearer " + token }, {'user': user.id})
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const blogsNow = await (await api.get('/api/blogs')).body

    assert.strictEqual(blogsNow.length, initialBlogs.length + 1)

    const contents = blogsNow.map(blog => blog.title)
    assert(contents.includes('The ever changing degree'))

})

// to set a default of 0, go into the mongoose schema and set default
test('if likes property is missing default to 0', async () => {
    
    const user = await helper.firstUser()
    const token = await helper.token()

      console.log("the token", token)

    const newBlog = {
        title: "The ever changing degree",
        author: "Wiki Jones",
        url: "Wikipeek.com",
        user: user.id
    }

    const response = await api.post('/api/blogs')
        .send(newBlog)
        .set({ 'Authorization' : "Bearer " + token }, {'user': user.id})
        .expect(201)

    const blog = response.body


    console.log(blog)
    assert(Object.getOwnPropertyNames(blog).includes("likes"))
    assert(blog.likes === 0)
})

test('verify posts cannot be created with a missing title or url', async () => {
    const user = await helper.firstUser()
    const token = await helper.token()
    
    const newBlog = {
        author: "Wiki Jones",
        user: user.id,
        likes: 0
    }

    const response = await api.post('/api/blogs')
        .send(newBlog)
        .set({ 'Authorization' : "Bearer " + token }, {'user': user.id})
        .expect(400)

})

test('verify can fetch a single blog by id', async () => {

    const response = await api.get('/api/blogs').expect(200)
    const blogs = response.body
    const firstBlog = blogs[0]

    const resp = await api.get(`/api/blogs/${firstBlog.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

  assert.deepStrictEqual(resp.body, firstBlog)

})

test.only('verify can delete a blog', async () => {
    
    const user = await helper.firstUser()
    const token = await helper.token()

    const newBlog = {
        title: "The ever changing degree",
        author: "Wiki Jones",
        url: "Wikipeek.com",
        user: helper.firstUser().id,
        likes: 1
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .set({ 'Authorization' : "Bearer " + token }, {'user': user.id})

    const blogs = await helper.blogsInDb()
    console.log("initial blogs", blogs)

    const startLength = blogs.length
    const lastBlog = blogs[blogs.length-1]
    console.log(lastBlog)
    

    await api
        .delete(`/api/blogs/${lastBlog.id}`)
        .set({ 'Authorization' : "Bearer " + token }, {'user': user.id})
        .expect(204)

    const res = await api.get('/api/blogs')
    console.log( res.body.length, " " , startLength - 1)
    assert(res.body.length === (startLength - 1))
})

test('verify if update changes the likes', async () => {
    const response = await api.get('/api/blogs')
    const firstBlog = blogs[0]
    const updated = await api.put(`/api/blogs/${firstBlog.id}`)
        .send({likes: 23})

    const checkUpdated = await api.get(`/api/blogs/${firstBlog.id}`)

    console.log("updated likes", checkUpdated.body)
    assert(checkUpdated.body.likes === 23)
})


// once all of the tests are finished running, close the database.
after(async () => {
    await mongoose.connection.close()
})