import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [notificationMessage, setNotificationMessage] = useState()
  const [notificationType, setNotificationType] = useState()

  useEffect(() => {
    const sortBlogs = async () => {
      const blogs = await blogService.getAll()
      blogs.sort((a,b) => a.likes - b.likes)
      setBlogs( blogs )
    }
    sortBlogs()
  }, [])


  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('blogAppUser')
    if(loggedUserJSON){
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])


  const handleLogin = async (userInformation) => {

    try{
      const user = await loginService.login(userInformation)

      blogService.setToken(user.token)
      setUser(user)

      window.localStorage.setItem('blogAppUser', JSON.stringify(user))


      setNotificationMessage(`${user.name} logged in successfully.`)
      setNotificationType('success')

      setTimeout(() => {
        setNotificationMessage()
        setNotificationType()
      }, 5000)

    } catch (error) {
      console.log(error)
      setNotificationMessage('invalid username or password')
      setNotificationType('error')

      setTimeout(() => {
        setNotificationMessage()
        setNotificationType()
      }, 5000)
    }

  }

  const handleCreateBlog = async (newBlog) => {

    try{
      const request = await blogService.create(newBlog)
      setBlogs(blogs.concat(request))
      console.log('new blog created', request)
      console.log('blog that gets concatenated', request)
      setNotificationMessage(`a new blog: ${newBlog.title} by ${newBlog.author} has been added.`)
      setNotificationType('success')

      setTimeout(() => {
        setNotificationMessage()
        setNotificationType()
      }, 5000)
    } catch (error){
      console.log(error)
      setNotificationMessage('All fields must have data present.')
      setNotificationType('error')

      setTimeout(() => {
        setNotificationMessage()
        setNotificationType()
      }, 5000)
    }
  }

  const handleLikes = async (id, likes) => {
    try{
      const response = await blogService
        .update(id, likes)
      
      console.log('into the try catch')

      const copy = blogs.map(blog => blog.id === id ? blog = response : blog)
      console.log('response', response)
      setBlogs(copy)

      // setNotificationMessage(`like button pressed.`)
      // setNotificationType('success')

      // setTimeout(() => {
      //   setNotificationMessage()
      //   setNotificationType()
      // }, 5000)
    } catch( error ) {
      console.log('error updating likes', error)
    }
  }

  // currently not preventing default because I want the auto-refresh
  const handleLogout = event => {
    window.localStorage.removeItem('blogAppUser')
  }

  const logout = () => (
    <form onSubmit={handleLogout}>
      <button type="submit">logout</button>
    </form>
  )

  const deleteHandler = async (id) => {
    try{
      await blogService.remove(id)
      const newBlogs = blogs.filter(blog => blog.id !== id)
      setBlogs(newBlogs)

      setNotificationMessage('Blog deleted.')
      setNotificationType('success')

      setTimeout(() => {
        setNotificationMessage()
        setNotificationType()
      }, 5000)

    } catch( error ){
      setNotificationMessage('Error deleting blog.')
      setNotificationType('error')

      setTimeout(() => {
        setNotificationMessage()
        setNotificationType()
      }, 5000)
    }
  }

  if(user === null){
    return (
      <div>
        <Notification message={notificationMessage} type={notificationType} />
        <h2>Log in to application</h2>
        <LoginForm handleLogin={handleLogin} />
      </div>
    )
  }
  return (
    <div>
      <Notification message={notificationMessage} type={notificationType} />
      <h2>blogs</h2>
      <div><b>{user.name}</b> is logged in {logout()}</div>
      <Togglable buttonLabel="Create Blog">
        <BlogForm createBlog={handleCreateBlog}/>
      </Togglable>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} likeHandler={handleLikes} deleteHandler={deleteHandler} user={user}/>
      )}
    </div>
  )
}

export default App