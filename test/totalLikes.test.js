const listHelper = require('../utils/list_helper')
const blogit = require('./blogcatalog')
describe('total likes', () => {

    test('Total likes test', () => {
        const result = listHelper.totalLikes(blogit.blogit)
        expect(result).toBe(36)
    })
})