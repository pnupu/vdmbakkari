const listHelper = require('../utils/list_helper')
const blogit = require('./blogcatalog')

describe('Favourite blog', () => {

    test('Favourite Blog test', () => {
        const result = listHelper.favoriteBlog(blogit.blogit)
        expect(result).toEqual({
            title: 'Canonical string reduction',
            author: 'Edsger W. Dijkstra',
            likes: 12 })
    })
})
