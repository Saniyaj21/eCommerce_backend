import { Product } from '../models/product.js';
import catchAsyncErrors from '../middleware/catchAsyncErrors.js'
import ApiFeatures from '../utils/apifeatures.js';


export const getAllProduct = async (req, res) => {

    try {
        const resultPerPage = 8;
        const productsCount = await Product.countDocuments();
        const apiFeature = new ApiFeatures(Product.find(), req.query)
            .search()
            .filter()
            .pagination(resultPerPage);


        let products = await apiFeature.query;
        let filteredProductsCount = products.length;


        res.status(200).json({
            success: true,
            products,
            productsCount,
            resultPerPage,
            filteredProductsCount,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Can't get product"
        });
    }
}

// admin only
export const createProduct = async (req, res) => {
    try {

        await Product.create(req.body);

        res.status(201).json({
            success: true,
            message: "product added Successfully",
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error
        });
    }
}

// Product Details
export const getProduct = async (req, res) => {
    const { id } = req.params
    try {
        const product = await Product.findById({ _id: id })
        res.status(200).json({
            success: true,
            product,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Can't get product"
        });
    }
}

// Admin Only
export const updateProduct = catchAsyncErrors(
    async (req, res) => {
        const { id } = req.params
        try {
            const product = await Product.finOneAndUpdate({ _id: id }, req.body, { new: true }) // return updated product
            res.status(200).json(
                {
                    success: true,
                    product,
                })
        } catch (error) {
            res.status(400).json(
                {
                    success: false,
                    message: "Can not update product"
                }
            )
        }
    }
)

// Admin Only
export const deleteProduct = async (req, res) => {
    const { id } = req.params
    try {
        const product = await Product.findOneAndDelete({ _id: id })
        res.status(200).json({
            success: true,
            product,
        })
    } catch (error) {
        res.status(400).json(error)
    }
}