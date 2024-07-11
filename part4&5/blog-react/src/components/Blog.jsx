import { useState } from 'react'

const Blog = ({ blog, likeHandler, deleteHandler, user }) => {

  const name = blog.user ? blog.user.name : ''
  const [visible, setVisible] = useState(false)
  const label = visible ? "hide" : "view"
  const showWhenVisible = { display: visible ? '': 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const likeButton = async () => {
    console.log('clicked the likeButton')
    likeHandler(blog.id, { likes: blog.likes+1 })
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const DeleteButton = () => {
    return (
      <button onClick={() => {deleteBlog(blog)}}>delete</button>
    )
  }

  const deleteBlog = (blog) => {
    if(window.confirm(`remove blog ${blog.title} by ${blog.author}`)){
      deleteHandler(blog.id)
    }
  }

  return (
    <div style={blogStyle}>
      <div className='show-always'>
        {blog.title} {blog.author}
        <button className='view-hide' onClick={() => {toggleVisibility()}}>{label}</button>
      </div>
      <div style={showWhenVisible} className='show-togglable'>
        {blog.url} <br></br>
        likes {blog.likes} <button onClick={likeButton}>like</button><br></br>
        {name} <br></br>
        {user.name !== name || <DeleteButton />}
      </div>
    </div>
  )}

export default Blog