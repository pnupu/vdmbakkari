const listHelper = require('../utils/list_helper')
const blogit = require('./blogcatalog')
describe('Most blogs', () => {

    test('Most Blogs test', () => {
        const result = listHelper.mostBlogs(blogit.blogit)
        expect(result).toEqual({
            author: 'Robert C. Martin',
            blogs: 3 })
    })
})
