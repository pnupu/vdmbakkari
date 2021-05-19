const Blog = require('../models/blog')
const User = require('../models/user')

const initialblogs = [
    {
        title: 'Blogi',
        author: 'kirjoittaja',
        url: 'url',
        likes: 3,
        __v: 0
    }
]

const initialUsers = [
    {
        username: 'username1',
        name: 'name1',
        password: 'salasana1'
    }
]
const blogsInDb = async () => {
    const blogs = await Blog.find({})
    blogs.map(blog => blog.toJSON())
    return blogs
}

const usersInDb = async () => {
    const users = await User.find({})
    users.map(user => user.toJSON())
    return users
}

module.exports = {
    initialblogs, blogsInDb, usersInDb, initialUsers
}