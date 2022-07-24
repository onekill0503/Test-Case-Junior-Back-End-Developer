let supertest = require('supertest')
request = supertest('http://localhost:3333');
const { faker } = require('@faker-js/faker');

// create random resource
const first_product = faker.music.songName()
const second_product = faker.music.songName()
const third_product = faker.music.songName()

// menambah produk
describe(`Add Product with Correct Input` , function() {

    test(`Add Product ${first_product} with no asset` , async () => {
        const category_id = await request.get(`/categories`).send().then(v => v.body.data[v.body.data.length - 1].id)
        const response = await request.put(`/products`).send({category: category_id , name: first_product , price: 200000})
        expect(response.status).toBe(200)
    })

    test(`Add Product ${second_product} with no asset` , async () => {
        const category_id = await request.get(`/categories`).send().then(v => v.body.data[v.body.data.length - 1].id)
        const response = await request.put(`/products`).send({category: category_id , name: second_product , price: 200000})
        expect(response.status).toBe(200)
    })
    test(`Add Product ${third_product} with asset` , async () => {
        const category_id = await request.get(`/categories`).send().then(v => v.body.data[v.body.data.length - 1].id)
        const response = await request.put(`/products`).field('category' , category_id).field('name' , third_product).field('price' , 300000).attach('images' , './test/resources/image1.jpg')
        expect(response.status).toBe(200)
    })
})

// menambah produk dengan data salah
describe(`Add Product with incorrect input` , function() {
    test(`Add Product with Missing Field` , async () => {
        const response = await request.put(`/products`).send({name: second_product , price: 200000})
        expect(response.status).toBe(500)
    })
    test(`Add Product with incorrect tipe data` , async () => {
        const category_id = await request.get(`/categories`).send().then(v => v.body.data[v.body.data.length - 1].id)
        const response = await request.put(`/products`).send({category: category_id , name: 3000 , price: '200000'})
        expect(response.status).toBe(500)
    })
    test(`Add Product with incorrect category` , async () => {
        const response = await request.put(`/products`).send({category: 100000000 , name: first_product , price: 200000})
        expect(response.status).toBe(500)
    })
})

// deleting last inputed category
describe(`Deleting Last Inserted Product` , function() {
    test(`Delete First Product` , async () => {
        // get product id
        const product = await request.get(`/products`).send()
        const product_input1 = product.body.data[product.body.data.length-3].id
        const response = await request.delete(`/products`).send({product_id: product_input1})
        expect(response.status).toBe(200)
    })
    test(`Delete Product with wrong ID` , async () => {
        const response = await request.delete(`/products`).send({product_id: 1233445})
        expect(response.status).toBe(404)
    })
    test(`Delete Second and Third Product` , async () => {
        // get product id
        const product = await request.get(`/products`).send()
        const product_input2 = product.body.data[product.body.data.length-2].id
        const product_input3 = product.body.data[product.body.data.length-1].id
        const response = await request.delete(`/products`).send({product_id: `${product_input2},${product_input3}`})
        expect(response.status).toBe(200)
    })
    test(`Delete Product with 1 wrong ID` , async () => {
        // get product id
        const product = await request.get(`/products`).send()
        const product_input2 = product.body.data[product.body.data.length-2].id
        const product_input3 = product.body.data[product.body.data.length-1].id
        const response = await request.delete(`/products`).send({product_id: `${product_input2},${product_input3},238778`})
        expect(response.status).toBe(404)
    })
})