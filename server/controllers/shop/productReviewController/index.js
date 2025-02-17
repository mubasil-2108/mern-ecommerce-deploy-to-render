
const Order = require('../../../models/order');
const Product = require('../../../models/products');
const ProductReview = require('../../../models/review');


const addProductReview = async (req, res) => {
    try {
        const { productId, userId, userName, reviewMessage, reviewValue } = req.body;
        const order = await Order.findOne({
            userId,
            "cartItems.productId": productId,
            orderStatus: 'confirmed',
        })

        if (!order) {
            return res.status(403).json({
                success: false,
                message: 'You have not ordered this product before',
            })
        }

        const checkExistingReview = await ProductReview.findOne({
            productId,
            userId
        })

        if (checkExistingReview) {
            return res.status(400).json({
                success: false,
                message: 'You have already reviewed this product',
            })
        }

        const newReview = new ProductReview({
            productId, userId, userName, reviewMessage, reviewValue
        })
        await newReview.save();

        const reviews = await ProductReview.find({ productId });
        const totalReviewsLength = reviews.length;
        const averageReview = reviews.reduce((sum, reviewItem) => sum + reviewItem.reviewValue, 0) / totalReviewsLength;
        await Product.findByIdAndUpdate(productId, { averageReview })

        res.status(201).json({
            success: true,
            data: newReview
        })

    } catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
}

const getProductReviews = async (req, res) => {
    try {
        const { productId } = req.params;

        const reviews = await ProductReview.find({ productId });
        res.status(200).json({
            success: true,
            data: reviews
        })
    } catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
}

module.exports = { addProductReview, getProductReviews };