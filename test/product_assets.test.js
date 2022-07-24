let supertest = require('supertest')
request = supertest('http://localhost:3333');
const { faker } = require('@faker-js/faker');

// menambah asset produk
describe(`Add Product Asset with correct input` , function() {
    test(`Add Product Asset for last product` , async () => {
        const product_id = await request.get(`/products`).send().then(v => v.body.data[v.body.data.length - 1].id)
        const response = await request.put(`/assets`).field('product_id' , product_id).attach('images' , './test/resources/image1.jpg')
        expect(response.status).toBe(200)
    })
    test(`Add Multiple Product Asset for last product` , async () => {
        const product_id = await request.get(`/products`).send().then(v => v.body.data[v.body.data.length - 1].id)
        const response = await request.put(`/assets`).field('product_id' , product_id).attach('images' , './test/resources/image2.jpg').attach('images' , './test/resources/image3.jpg')
        expect(response.status).toBe(200)
    }) 
})

// menambah asset dengan input salah
describe(`Add Product Asset with incorrect input` , function() {
    test(`Add Product wiht missing product_id field` , async () => {
        const response = await request.put(`/assets`).attach('images' , './test/resources/image1.jpg')
        expect(response.status).toBe(500)
    })
    test(`Add Product wiht missing images field` , async () => {
        const product_id = await request.get(`/products`).send().then(v => v.body.data[v.body.data.length - 1].id)
        const response = await request.put(`/assets`).field('product_id' , product_id)
        expect(response.status).toBe(500)
    })
    test(`Add Product wiht incorrect product_id data type` , async () => {
        const response = await request.put(`/assets`).field('product_id' , 'product_id').attach('images' , './test/resources/image1.jpg')
        expect(response.status).toBe(500)
    })
})

// menghapus asset produk
describe(`Delete Product Asset` , function() {
    test(`Deleteing 1 product asset` , async () => {
        const assets = await request.get(`/products`).send().then(v => v.body.data[v.body.data.length - 1].assets)
        const last_asset_id = assets[assets.length - 1].id
        const response = await request.delete(`/assets`).send({asset_id : last_asset_id})
        expect(response.status).toBe(200)
    })
    test(`Deleteing multiple product asset with one missing id` , async () => {
        const assets = await request.get(`/products`).send().then(v => v.body.data[v.body.data.length - 1].assets)
        const second = assets[assets.length - 1].id
        const first = assets[assets.length - 2].id
        const response = await request.delete(`/assets`).send({asset_id : `${first},${second},1233`})
        expect(response.status).toBe(500)
    })
    test(`Deleteing multiple product asset` , async () => {
        const assets = await request.get(`/products`).send().then(v => v.body.data[v.body.data.length - 1].assets)
        const second = assets[assets.length - 1].id
        const first = assets[assets.length - 2].id
        const response = await request.delete(`/assets`).send({asset_id : `${first},${second}`})
        expect(response.status).toBe(200)
    })
    test(`Deleteing 1 product asset with invalid id` , async () => {
        const response = await request.delete(`/assets`).send({asset_id : '123'})
        expect(response.status).toBe(500)
    })
})