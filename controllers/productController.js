import { Product } from '../models/product.js';
import catchAsyncErrors from '../middleware/catchAsyncErrors.js'
import ApiFeatures from '../utils/apifeatures.js';







// Create New Review or Update the review
// Get All Reviews of a product
// Delete Review


// Get All Product
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

// Create Product -- Admin
export const createProduct = async (req, res) => {
    try {
        req.body.user = req.user.id;
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

// Get Product Details
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


// Get All Product (Admin)
export const getAdminProducts = async (req, res) => {
    try {
        const products = await Product.find();

        res.status(200).json({
            success: true,
            products,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Can't get product"
        });
    }
};

// Update Product -- Admin
export const updateProduct = catchAsyncErrors(
    async (req, res) => {
        const { id } = req.params
        try {
            const product = await Product.findOneAndUpdate({ _id: id }, req.body, { new: true }) // return updated product
            res.status(200).json(
                {
                    success: true,
                    product,
                })
        } catch (error) {
            res.status(400).json(
                {
                    success: false,
                    message: error.message
                }
            )
        }
    }
)


// Delete Product - admin
export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params
        const product = await Product.findOneAndDelete({ _id: id })
        res.status(200).json({
            success: true,
            product,
        })
    } catch (error) {
        res.status(400).json(error)
    }
}

// Create New Review or Update the review
export const createProductReview = async (req, res) => {

    try {
        const { rating, comment, productId } = req.body;

        const review = {
            user: req.user._id,
            name: req.user.name,
            rating: Number(rating),
            comment,
        };
        const product = await Product.findById(productId);

        const isReviewed = product.reviews.find(
            (rev) => rev.user.toString() === req.user._id.toString()
        );

        if (isReviewed) {
            product.reviews.forEach((rev) => {
                if (rev.user.toString() === req.user._id.toString())
                    (rev.rating = rating), (rev.comment = comment);
            });
        } else {
            product.reviews.push(review);
            product.numOfReviews = product.reviews.length;
        }
        // setting the reviews -> average of total reviews
        let totalReview = 0;

        product.reviews.forEach((rev) => {
            totalReview += rev.rating;
        });
        product.ratings = totalReview / product.reviews.length;

        await product.save({ validateBeforeSave: false });

        res.status(200).json({
            success: true,
            product,
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

// Get All Reviews of a product
export const getProductReviews = async (req, res) => {

    try {

        const id = req.query.id

        const product = await Product.findById({ _id: id })

        res.status(200).json({
            success: true,
            reviews: product.reviews,
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Product not found"
        })
    }
}
// Delete Reviews of a product
// need productId and review id as id
export const deleteReview = async (req, res) => {

    try {
       
        const productId = req.query.productId
    

        const product = await Product.findById({ _id: productId })
        
        if (!product) {
            return res.status(400).json({
                success: false,
                message: "Product not found"
            })
        }
        const reviews = product.reviews.filter(
            (rev) => rev._id.toString() !== req.query.id.toString()
        );

        let avg = 0;

        reviews.forEach((rev) => {
            avg += rev.rating;
        });

        let ratings = 0;

        if (reviews.length === 0) {
            ratings = 0;
        } else {
            ratings = avg / reviews.length;
        }

        const numOfReviews = reviews.length;

        await Product.findByIdAndUpdate(
            req.query.productId,
            {
                reviews,
                ratings,
                numOfReviews,
            },
            {
                new: true,
                runValidators: true,
                useFindAndModify: false,
            }
        );

        res.status(200).json({
            success: true,
            reviews: product.reviews,
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        })
    }
}