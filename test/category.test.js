let supertest = require('supertest')
request = supertest('http://localhost:3333');
const { faker } = require('@faker-js/faker');


const first_category = faker.music.genre()
const second_category = faker.music.genre()
const third_category = faker.music.genre()

// memberikan input yang benar
describe(`Add new Category with Correct Input`, function(){
    test(`Add new Category with Input Category ${first_category}` , async () => {
        const response = await request.put(`/categories`).send({category_name: first_category})
        expect(response.status).toBe(200)
    })
    test(`Add new Category with Input Category ${second_category}` , async () => { 
        const response = await request.put(`/categories`).send({category_name: second_category})
        expect(response.status).toBe(200)
    })
    test(`Add new Category with Input Category ${third_category}` , async () => { 
        const response = await request.put(`/categories`).send({category_name: third_category})
        expect(response.status).toBe(200)
    })
})

// memberikan input yang salah
describe(`Wrong Input`, function(){
    test(`Add new Category with Input Category ${first_category}` , async () => {
        const response = await request.put(`/categories`).send({category_name2: first_category})
        expect(response.status).toBe(500)
    })
    test(`Add new Category with Input Category 1234` , async () => {
        const response = await request.put(`/categories`).send({category_name: 123})
        expect(response.status).toBe(500)
    })
})

// deleting last inputed category
describe(`Deleting Last Inserted Category` , function() {
    test(`Delete Category ${first_category}` , async () => {
        const category = await request.get(`/categories`).send()
        category_input1 = category.body.data[category.body.data.length-3].id
        const response = await request.delete(`/categories`).send({categories_id: category_input1})
        expect(response.status).toBe(200)
    })
    test(`Delete Category with wrong ID` , async () => {
        const response = await request.delete(`/categories`).send({categories_id: 1233445})
        expect(response.status).toBe(404)
    })
    test(`Delete Category with ID ${second_category} and ${third_category}` , async () => {
        const category = await request.get(`/categories`).send()
        category_input2 = category.body.data[category.body.data.length-2].id
        category_input3 = category.body.data[category.body.data.length-1].id
        const response = await request.delete(`/categories`).send({categories_id: `${category_input2},${category_input3}`})
        expect(response.status).toBe(200)
    })
})