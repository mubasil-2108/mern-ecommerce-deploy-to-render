
const Product = require('../../../models/products')


const searchProducts = async (req, res) => {
    try {
        const { keyword } = req.params;
        if (!keyword || typeof keyword !== 'string') {
            return res.status(400).json({
                status: false,
                message: 'Keyword is required and must be in string format',
            })
        }

        const regEx = new RegExp(keyword, 'i')
        const createSearchQuery = {
            $or: [
                { title: regEx },
                { description: regEx },
                { category: regEx },
                { brand: regEx },

            ]
        }

        const searchResults = await Product.find(createSearchQuery)

        res.status(200).json({
            status: true,
            data: searchResults,
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error searching products',
        })
    }
}

module.exports = { searchProducts };