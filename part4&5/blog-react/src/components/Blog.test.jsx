import { render, screen } from "@testing-library/react";
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import { expect, test } from "vitest";

test('Blog component displays title and author', () => {

    const newUser = {
        username: "jeff",
        name: "jeff"
    }

    const blog = {
        title: "A blog with a title",
        author: "author man",
        url: "blog.com",
        likes: 1
    }

    const { container } = render(<Blog blog={blog} user={newUser}/>)

    const element1 = screen.getByText('A blog with a title', { exact: false })
    const element2 = screen.getByText('author man', { exact: false })
    const hidden = container.querySelector('.show-togglable')

    
    expect(element1).toBeDefined()
    expect(element2).toBeDefined()
    expect(hidden).toHaveStyle('display: none')
})

test('Blog url and likes are displayed on button click', async () => {

    const newUser = {
        username: "jeff",
        name: "jeff"
    }

    const blog = {
        title: "A blog with a title",
        author: "author man",
        url: "blog.com",
        likes: 1
    }

    const { container } = render(<Blog blog={blog} user={newUser}/>)


    const user = userEvent.setup()
    const button = screen.getByText("view")
    await user.click(button)

    const hidden = container.querySelector('.show-togglable')
    expect(hidden).not.toHaveStyle('display: none')
})

test('If likes clicked twice event handler needs to be called twice', async () => {

    const newUser = {
        username: "jeff",
        name: "jeff"
    }

    const blog = {
        title: "A blog with a title",
        author: "author man",
        url: "blog.com",
        likes: 1
    }

    const mockLikeHandler = vi.fn()

    render(<Blog blog={blog} likeHandler={mockLikeHandler} user={newUser}/>)

    const user = userEvent.setup()
    const button = screen.getByText("like")
    await user.click(button)
    await user.click(button)

    console.log(mockLikeHandler.mock.calls)
    expect(mockLikeHandler.mock.calls).toHaveLength(2)


})