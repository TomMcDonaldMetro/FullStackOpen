import { useState } from 'react'

const BlogForm = ({ createBlog }) => {

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')


  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title,
      author,
      url
    })
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (


    <div>

      <h4>Create new Blog</h4>
      <form onSubmit={addBlog}>

        <div>
        Title:
          <input data-testid='title' type="text" value={title} name="title" onChange={({ target }) => setTitle(target.value)} placeholder='enter title'></input>
        </div>
        <div>
        Author:
          <input data-testid='author' type="text" value={author} name="author" onChange={({ target }) => setAuthor(target.value)} placeholder='enter author'></input>
        </div>
        <div>
        URL:
          <input data-testid='url' type="text" value={url} name="url" onChange={({ target }) => setUrl(target.value)}placeholder='enter url'></input>
        </div>
        <button type="submit">Create</button>

      </form>
    </div>

  )
}
export default BlogForm