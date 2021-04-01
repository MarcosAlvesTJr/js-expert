const { describe, it } = require('mocha')
const request = require('supertest')
const app = require('./api')
const { deepStrictEqual } = require('assert')

describe('API suit test', () => {
    describe('/contact', () => {
        it('should request contact page and return HTTP status 200', async () => {
            const response = await request(app).get('/contact').expect(200)
            console.log(response)
            deepStrictEqual(response.text, 'contact us page')
        })
    })

    describe('/hello', () => {
        it('should request an inexisting route /hi and redirect to /hello', async () => {
            const response = await request(app).get('/hi').expect(200)
            deepStrictEqual(response.text, 'Hello world!')
        })
    })


    describe('/login', () => {
        it('should successfully login and return HTTP status 200', async () => {
            const response = await request(app)
                .post('/login')
                .send({ username: 'Marcos', password: '123' })
                .expect(200)

            deepStrictEqual(response.text, 'Login successful!')
        })
        it('should fail with wrong credentials', async () => {
            const response = await request(app)
                .post('/login')
                .send({ username: 'Marcos', password: '321' })
                .expect(401)

            deepStrictEqual(response.text, 'Login failed!')
        })
    })
})