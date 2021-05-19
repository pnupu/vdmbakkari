const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const api = supertest(app)
const helper = require('./test_helper')
const blogit = require('./blogcatalog')
const bcrypt = require('bcryptjs')
const User = require('../models/user')
const jsonwebtoken = require('jsonwebtoken')
jest.setTimeout(60000)

beforeEach(async () => {
    await Blog.deleteMany({})

    let blogObject = new Blog(helper.initialblogs[0])
    await blogObject.save()
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()

})

test('blogs are returned as json', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)

})

test('there is one blog', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(helper.initialblogs.length)
})

test('blogs have id', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body[0].id).toBeDefined()
})

test('Post Test', async () => {

    const newUser = {
        username: 'newUser',
        name: 'uusi nimi',
        password: 'salasana',
    }
    const logincreds = {
        username: 'newUser',
        password: 'salasana'
    }
    await api
        .post('/api/users')
        .send(newUser)
        .expect(200)
        .expect('Content-Type', /application\/json/)

    const response = await api
        .post('/api/login')
        .send(logincreds)
        .expect(200)
        .expect('Content-Type', /application\/json/)

    const token = response.body.token

    const blogToBeAdded = [
        {
            title: 'Uusi Blogi',
            author: 'naata',
            url: 'urli',
            likes: 7,
            __v: 0

        }
    ]
    let newBlog = new Blog(blogToBeAdded[0])
    await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(200)
        .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialblogs.length + 1)
    const title = blogsAtEnd.map(title => title.title)
    expect(title).toContain('Uusi Blogi')


})

test('Likes are zero', async () => {
    const newUser = {
        username: 'newUser',
        name: 'uusi nimi',
        password: 'salasana',
    }
    const logincreds = {
        username: 'newUser',
        password: 'salasana'
    }
    await api
        .post('/api/users')
        .send(newUser)
        .expect(200)
        .expect('Content-Type', /application\/json/)

    const response = await api
        .post('/api/login')
        .send(logincreds)
        .expect(200)
        .expect('Content-Type', /application\/json/)

    const token = response.body.token
    const blogToBeAdded = [
        {
            title: 'Uusi Blogi',
            author: 'naata',
            url: 'urli',
            __v: 0
        }
    ]
    let newBlog = new Blog(blogToBeAdded[0])
    await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(200)
        .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    const likes = blogsAtEnd.map(like => like.likes)
    expect(likes).toContain(0)

})

test('bad blog post test', async () => {
    const newUser = {
        username: 'newUser',
        name: 'uusi nimi',
        password: 'salasana',
    }
    const logincreds = {
        username: 'newUser',
        password: 'salasana'
    }
    await api
        .post('/api/users')
        .send(newUser)
        .expect(200)
        .expect('Content-Type', /application\/json/)

    const response = await api
        .post('/api/login')
        .send(logincreds)
        .expect(200)
        .expect('Content-Type', /application\/json/)

    const token = response.body.token

    const blogToBeAdded = [
        {
            author: 'naata',
            likes: 3,
            url: 'urli',
            __v: 0
        }
    ]

    await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(blogToBeAdded)
        .expect(400)
    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialblogs.length)
})

test('delete blog', async () => {
    const newUser = {
        username: 'newUser',
        name: 'uusi nimi',
        password: 'salasana',
    }
    const logincreds = {
        username: 'newUser',
        password: 'salasana'
    }
    await api
        .post('/api/users')
        .send(newUser)
        .expect(200)
        .expect('Content-Type', /application\/json/)

    const response = await api
        .post('/api/login')
        .send(logincreds)
        .expect(200)
        .expect('Content-Type', /application\/json/)

    const token = response.body.token


    const blogToBeAdded = [
        {
            title: 'Uusi Blogi',
            author: 'naata',
            url: 'urli',
            likes: 7,
            __v: 0

        }
    ]
    let newBlog = new Blog(blogToBeAdded[0])
    await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(200)
        .expect('Content-Type', /application\/json/)

    const blogsAtEndd = await helper.blogsInDb()
    expect(blogsAtEndd).toHaveLength(helper.initialblogs.length + 1)
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[1]
    await api
        .delete(`/api/blogs/${blogToDelete._id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(1)

})
test('delete request fails', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]
    await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(401)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(blogsAtStart.length)
})
test('update blog', async () => {
    const blogsAtStart = await helper.blogsInDb()
    let blogToUpdate = new Blog(blogsAtStart[0])
    blogToUpdate.likes = blogToUpdate.likes + 1
    console.log(blogToUpdate)
    await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(blogToUpdate)
        .expect(200)


    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd[0].likes).toEqual(blogToUpdate.likes)
})


describe('when there is initially one user at db', () => {
    beforeEach(async () => {
        await User.deleteMany({})

        const passwordHash = await bcrypt.hash('sekret', 10)
        const user = new User({ username: 'root', passwordHash })

        await user.save()
    })

    test('creation succeeds with a fresh username', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'newUser',
            name: 'uusi nimi',
            password: 'salasana',
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

        const usernames = usersAtEnd.map(u => u.username)
        expect(usernames).toContain(newUser.username)
    })
    test('creation fails with proper statuscode and message if username already taken', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'root',
            name: 'Superuser',
            password: 'salainen',
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(result.body.error).toContain('`username` to be unique')

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })
})
afterAll(() => {
    mongoose.connection.close()
})