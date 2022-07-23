const models = require('../models/index')
const joi = require('joi')
const { Sequelize } = require('../models/index')
const fs = require('fs');
const path = require('path')

// Extended Function
const deleteAssetFunction = async (assets_id) => {
    // make id into array
    idList = assets_id.split(",")

    // get assets records
    const asset = await models.Products_assets.findAll({raw:true ,where: {id: idList}})

    // check if some asset is not found
    if(!asset || idList.length != asset.length){
        // put founded asset id to array
        const idListRecorded = asset.map(e => e.id.toString())
        // get the missing asset id
        filtered = idList.filter(val => {return idListRecorded.indexOf(val) == -1})

        throw new Error(`Asset with id ${filtered.join(',')} not found`)
    }

    // Delete records
    await models.Products_assets.destroy({where: {id: idList}})

    // delete local files
    asset.map(v => {
        fs.unlinkSync(`${__dirname}/../uploads/${v.image}`)
    })
}

const addAssetsFunction = async (files , product_id) => {
    try {
        // fetch filename into array
        const listFile = files.map(v => {
            return {product_id: product_id , image: v.filename}
        })
        await models.Products_assets.bulkCreate(listFile)
    }catch(error){
        throw new Error(error.message)
    }
}


module.exports = {
    getCategories: async (req , res) => {
        try {
            if(req.body.sorted && (req.body.sorted == 'true' || req.body.sorted == true)){
                // get All Categories with sorted results
                var Categories = await models.Categories.findAll({
                    include: ["products"] ,
                    order: [[Sequelize.literal('(SELECT COUNT(*) FROM products WHERE Category_id = categories.id)') , "DESC"]]
                })
            }else {
                // get All Categories without sorted result
                var Categories = await models.Categories.findAll({include: ['products']})
            }

            // give response
            res.status(200).json({
                data: Categories,
                Success: true
            })

        }catch(error){
            return res.status(500).json({
                message: error.message,
                success: false,
                http_code: 500
            })
        }
    },
    addCategories: async (req , res) => {
        try {
            // create validation schema
            const schema = joi.object({
                category_name: joi.string().min(3).required()
            })
            // Validate Data
            const data = schema.validate(req.body);
            if(data.error) throw data.error;
            // make the string into array
            var categories = data.value.category_name.split(',')
            // find if the category exists
            const checkCategory = await models.Categories.findAll({raw: true,where: {name: categories}})
            var http_response = {}
            if(checkCategory.length > 0){
                var exist_category = []
                checkCategory.map(v => {
                    categories.splice(categories.indexOf(v.name) , 1)
                    exist_category.push(v.name)
                })
                http_response.optional_info = `Category : ${exist_category.join(',')} already exists in our records.`
            }
            // check if there's unexist category
            if(categories.length > 0) {
                const structured_category = categories.map(v => {return {name: v}})
                await models.Categories.bulkCreate(structured_category) 
                http_response.message = `Successfully adding : ${categories.join(',')} Category`
            }else {
                http_response.message = `No category recorded to our server`
            }

            // create response object
            http_response.success = true;

            return res.status(200).json(http_response)

        }catch(error){
            return res.status(500).json({
                message: error.message,
                success: false,
                http_code: 500
            })
        }
    },
    deleteCategories: async (req , res) =>{
        try {
            // create validation schema
            const schema = joi.object({categories_id: joi.string().min(1).required()})
            // Validate Data
            const data = schema.validate(req.body);
            if(data.error) throw data.error;
            
            // make it array
            const listCategories = data.value.categories_id.split(',')

            // check the category
            const categories = await models.Categories.findAll({raw:true , where: {id: listCategories}})
            if(categories.length > 0){
                var newList = categories.map(v => v.id)

                // Delete Records
                await models.Categories.destroy({where: {id: newList}})
            }else {
                return res.status(404).json({success: false , message: `Categories Record not found.`})
            }

            // giving reponse
            return res.status(200).json({
                success: true,
                message: `Successfully Deleted Category`
            })
        }catch(error){
            return res.status(500).json({
                message: error.message,
                success: false,
                http_code: 500
            })
        }
    },
    getProducts: async (req , res) => {
        try {
            
            if(req.body.sorted && (req.body.sorted == 'true' || req.body.sorted == true)){
                // get All Products with DESC sort and assets
                var products = await models.Products.findAll({order: [['price' , 'DESC']] , include: ["assets"]});
            } else {
                // get all products without DESC sort
                var products = await models.Products.findAll({include: ["assets"]});
            }

            return res.status(200).json({
                data: products,
                Success: true
            })
        }catch(error){
            return res.status(500).json({
                message: error.message,
                success: false,
                http_code: 500
            })
        }
    },
    addProduct: async (req , res) => {
        try {
            // Create Validation Schema
            schema = joi.object({
                category: joi.number().required(),
                name: joi.string().min(3).required(),
                price: joi.number().min(1).required()
            })
            // Validate Data
            const data = schema.validate(req.body);
            if(data.error) throw data.error;

            // membuat slug
            const slug = data.value.name.split(' ').join('-')

            // Insert Data
            const product = await models.Products.create({
                Category_id: data.value.category,
                name: data.value.name,
                slug: slug,
                price: data.value.price
            })

            // Check if there's images uploaded
            if(req.files || req.files > 0){
                await addAssetsFunction(req.files , product.id)
            }

            // server response
            res.status(200).json({
                success: true,
                http_code: 200,
            }) 

        }catch(error){
            return res.status(500).json({
                message: error.message,
                success: false,
                http_code: 500
            })
        }
    },
    editProduct: async (req , res) => {
        try {
            // Create validation schema
            const schema = joi.object({
                product_id: joi.string().required(),
                name: joi.string().min(3).required(),
                category: joi.string().required(),
                price: joi.number().min(3).required(),
                deleted_asset: joi.string().optional()
            })

            // Validate Data
            const data = schema.validate(req.body);
            if(data.error) throw data.error;

            // Check if Product Exist
            const product = await models.Products.findOne({where: {id: data.value.product_id}})
            if(!product) return res.status(404).json({success: false , message: `Product with ID ${data.value.product_id} not found.`})

            // create slug value
            const slug = data.value.name.split(' ').join('-')

            // Deleting Asset if parameter deleted_asset not empty
            if(data.value.deleted_asset) await deleteAssetFunction(data.value.deleted_asset)

            // Check if there's images uploaded
            if(req.files || req.files > 0){
                await addAssetsFunction(req.files , product.id)
            }

            // Update the records
            await models.Products.update({
                name: data.value.name,
                category: data.value.category,
                price: data.value.price,
                slug: slug
            } , {where: {id: data.value.product_id}} )

            // success response
            return res.status(200).json({
                success: true,
                message: `Successfully Updating Record.`
            })

        } catch(error){
            return res.status(500).json({
                message: error.message,
                success: false,
                http_code: 500
            })
        }
    },
    deleteProduct: async (req , res) => {
        try {
            // Create validation schema
            const schema = joi.object({
                product_id: joi.string().required()
            })
            // Validating Data
            const data = schema.validate(req.body);
            if(data.error) throw data.error;

            // make id into array
            idList = data.value.product_id.split(",")

            // Check if the product exist
            const products = await models.Products.findAll({where: {id: idList}, include: ["assets"]})

            if(!products || idList.length != products.length){
                // put founded asset id to array
                const idListRecorded = products.map(e => e.id.toString())
                // get the missing asset id
                filtered = idList.filter(val => {return idListRecorded.indexOf(val) == -1})

                return res.status(200).json({
                    success: false,
                    message: `Products with id ${filtered.join(',')} not found`
                })
            }

            // put asset into array
            var assetId = []
            var assetImage = []
            products.map(v => {
                v.assets.map(e => {
                    assetId.push(e.dataValues.id)
                    assetImage.push(e.dataValues.image)
                })
            })

            // Delete records
            await models.Products_assets.destroy({where: {id: assetId}})

            // delete local files
            assetImage.map(v => {
                fs.unlinkSync(`${__dirname}/../uploads/${v}`)
            })

            await models.Products.destroy({where: {id: idList}})

            return res.status(200).json({
                success: true,
            })

        }catch(error){
            return res.status(500).json({
                message: error.message,
                success: false,
                http_code: 500
            })
        }
    },
    addAssets: async (req , res) => {
        try{
            // create data validation schema
            const schema = joi.object({
                product_id: joi.number().required()
            })
            // Check if there's images uploaded
            if(req.files || req.files > 0){

                // Validating Data
                const data = schema.validate(req.body);
                if(data.error) throw data.error;

                // fetch filename into array
                const listFile = req.files.map(v => {
                    return {product_id: data.value.product_id , image: v.filename}
                })
                await models.Products_assets.bulkCreate(listFile)
            }else throw "No image uploaded."

            // server response
            res.status(200).json({
                success: true,
                http_code: 200,
            })
        }catch(error){
            return res.status(500).json({
                message: error.message,
                success: false,
                http_code: 500
            })
        }
    },
    deleteAssets: async function(req , res) {
        try{
            // create data validation schema
            const schema = joi.object({
                asset_id: joi.string().required()
            })
            // Validating Data
            const data = schema.validate(req.body);
            if(data.error) throw data.error;

            // running delete asset function
            await deleteAssetFunction(data.value.asset_id)

            return res.status(200).json({
                success: true,
                message: `Success Deleted Asset`
            })

        }catch(error){
            return res.status(500).json({
                message: error.message,
                success: false,
                http_code: 500
            })
        }
    }
}