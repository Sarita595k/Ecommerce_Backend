import { Product } from "../models/product.js"
import { ErrorHandler } from "../utils/errorHandler.js"

// import the features of api like search by keyword 
import { ApiFeatures } from "../utils/apiFeatures.js"

// create new product 
export const newProduct = async (req, res, next) => {

    req.body.user = req.user.id
    const product = await Product.create(req.body)
    res.status(201).json({
        success: true,
        product
    })
}

// get all products /api/products?keywords="apple"
export const getProducts = async (req, res, next) => {

    const resPerPage = 6;

    // used in frontend to check how many products are there
    const productCount = await Product.countDocuments()

    const apiFeatures = new ApiFeatures(Product.find(), req.query)
        .search()
        .filter()
        .pagination(resPerPage)

    const products = await apiFeatures.query;

    res.status(200).json({
        success: true,
        count: products.length,
        productsCount: productCount,
        resPerPage,
        products
    })
}

// get single product details  api/products/:id

export const getSingleProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return next(new ErrorHandler("Product not found", 404));
        }

        res.status(200).json({
            success: true,
            product,
        });
    } catch (error) {
        return next(new ErrorHandler("Invalid Product ID", 400));
    }
};

// update product api/products/:id

export const updateProduct = async (req, res, next) => {
    try {
        let product = await Product.findById(req.params.id)
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            })
        }

        product = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
            useFindAndModify: false
        })

        res.status(200).json({
            success: true,
            product
        })
    } catch (err) {
        return res.status(404).json({
            success: false,
            message: "Invalid product id"
        })
    }
}

// delete product api/product/admin/:id

export const deleteProduct = async (req, res, next) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            })
        }
        res.status(200).json({
            success: true,
            message: "Product is deleted successfully"
        })
    } catch (err) {
        return res.status(404).json({
            success: false,
            message: "Invalid product id"
        })
    }
}
// end of code