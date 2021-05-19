const listHelper = require('../utils/list_helper')
const blogit = require('./blogcatalog')

describe('Most likes', () => {

    test('Most likes test', () => {
        const result = listHelper.mostLikes(blogit.blogit)
        expect(result).toEqual({
            author: 'Edsger W. Dijkstra',
            likes: 17 })
    })
})