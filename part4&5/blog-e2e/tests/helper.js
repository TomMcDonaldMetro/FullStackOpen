const login = async (page, username, password) => {
    await page.getByTestId('username').fill(username)
    await page.getByTestId('password').fill(password)
    await page.getByRole('button', {name: "login"}).click()
}

const createBlog = async (page, title, author, url) => {
    await page.getByRole('button', {name: 'Create Blog'}).click()
    await page.getByTestId('title').fill(title)
    await page.getByTestId('author').fill(author)
    await page.getByTestId('url').fill(url)
    await page.getByRole('button', {name: 'Create'}).click()
    await page.getByText(`${title} by ${author}`).waitFor()
}

export { login, createBlog }