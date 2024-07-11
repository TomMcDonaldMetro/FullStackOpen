const { test, expect, beforeEach, describe } = require('@playwright/test')
const { login, createBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    // empty the db here
    await request.post('http://localhost:5173/api/testing/reset')
    // create a user for the backend here
    await request.post('http://localhost:5173/api/users', {
        data: {
            name: "test-machine",
            username: "test",
            password: "test"
        }
    })
    await request.post('http://localhost:5173/api/users', {
        data: {
            name: "test-doub",
            username: "root",
            password: "root"
        }
    })
    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {
    
    expect(page.getByText('Log in to application')).toBeVisible()
    expect(page.getByText('username')).toBeVisible()
    expect(page.getByText('password')).toBeVisible()


  })
  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await login(page, "test", "test")
      await expect(page.getByText('test-machine logged in successfully.')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
        await login(page, "test", "fakepassword")
        await expect(page.getByText('invalid username or password')).toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await login(page, "test", "test")
    })
  
    test('a new blog can be created', async ({ page }) => {      
        await createBlog(page, 'New Blog', 'Playwright', 'blogtest.com')
        await expect(page.getByText('a new blog: New Blog by Playwright has been added.')).toBeVisible()

    })

    test('a blog can be liked', async ({ page }) => {
        await createBlog(page, 'Second Blog', 'Playwright', 'blogtester.com')
        await page.getByRole('button', {name: "view"}).click()
        await page.getByRole('button', {name: 'like'}).click()
        await expect(page.getByText('1')).toBeVisible()
    })

    test('correct user can delete a blog', async ({ page }) => {
        await createBlog(page, 'A Blog', 'Playwright', 'blogtester.com')
        await page.getByRole('button', {name: "view"}).click()
        const locator = page.getByText('blogtester.com')
        await locator.waitFor()
        page.on('dialog', dialog => dialog.accept());
        await page.getByRole('button', {name: "delete"}).click()
        await expect(page.getByText('A Blog by Playwright')).not.toBeVisible()
    })

    test('only user who made the blog can see the delete button', async ({ page }) => {
        await createBlog(page, 'A Blog', 'Playwright', 'blogtester.com')
        await page.getByRole('button', {name: "view"}).click()
        const locator = page.getByText('blogtester.com')
        await locator.waitFor()
        expect(page.getByRole('button', {name: 'delete'})).toBeVisible()

        await page.getByRole('button', {name: 'logout'}).click()
        //await locator.waitFor('hidden') // wait for the blog to disappear
        await login(page, "root", "root")
        await page.getByRole('button', {name: "view"}).click()
        const locator2 = page.getByText('blogtester.com')
        await locator2.waitFor()
        expect(page.getByRole('button', {name: 'delete'})).not.toBeVisible()
    })

    


  })

  describe('comparing blogs', () => {
    beforeEach(async ({ page }) => {
        await createBlog(page, '1 Blog', '1Playwright', '1blogtester.com')
        await createBlog(page, '2 Blog', '2Playwright', '2blogtester.com')
        await createBlog(page, '3 Blog', '3Playwright', '3blogtester.com')
    })
    test('ensure blogs are ordered by likes', async ({page}) => {
      
    })
  })
})