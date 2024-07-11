import { render, screen } from "@testing-library/react";
import userEvent from '@testing-library/user-event'
import BlogForm from "./BlogForm";
import { expect, test } from "vitest";

test('calling event handler correctly in BlogForm', async () => {

    const user = userEvent.setup()
    const mockCreateHandler = vi.fn()

    render(<BlogForm createBlog={mockCreateHandler} />)

    const inputTitle = screen.getByPlaceholderText('enter title')
    const inputAuthor = screen.getByPlaceholderText('enter author')
    const inputUrl = screen.getByPlaceholderText('enter url')

    const button = screen.getByText('Create')

    await user.type(inputTitle, "my title")
    await user.type(inputAuthor, "my author")
    await user.type(inputUrl, "myurl.com")

    await user.click(button)

    expect(mockCreateHandler.mock.calls[0][0].title).toBe('my title')
    expect(mockCreateHandler.mock.calls[0][0].author).toBe('my author')
    expect(mockCreateHandler.mock.calls[0][0].url).toBe('myurl.com')
})