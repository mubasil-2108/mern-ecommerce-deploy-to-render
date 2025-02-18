require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const authRouter = require('./routes/auth');
const adminProductsRouter = require('./routes/admin/productsRoutes');
const adminOrderRouter = require('./routes/admin/ordersRoutes');

const shopProductsRouter = require('./routes/shop/productRoutes');
const shopCartRouter = require('./routes/shop/cartRoutes');
const shopAddressRouter = require('./routes/shop/addressRoutes');
const shopOrderRouter = require('./routes/shop/orderRoutes');
const shopSearchRouter = require('./routes/shop/searchRoutes');
const shopReviewRouter = require('./routes/shop/reviewRoutes');

const commonFeatureRouter = require('./routes/common/featureRoutes');

// Create Database Connection
// Create a separate file for this and import it here

mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        console.log('MongoDB Connected')
    }).catch((err) => {
        console.log(err)
    })

const app = express()
const PORT = process.env.PORT || 5000

app.use(
    cors({
        origin: process.env.CLIENT_BASE_URL,
        methods: ['GET', 'POST', 'DELETE', 'PUT'],
        allowedHeaders: [
            'Content-Type',
            'Authorization',
            'Cache-Control',
            'Expires',
            'Pragma',
        ],
        credentials: true,
    })
)

app.use(cookieParser());
app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/admin/products", adminProductsRouter);
app.use("/api/admin/orders", adminOrderRouter);

app.use("/api/shop/products", shopProductsRouter);
app.use("/api/shop/cart", shopCartRouter);
app.use("/api/shop/address", shopAddressRouter);
app.use("/api/shop/order", shopOrderRouter);
app.use("/api/shop/search", shopSearchRouter);
app.use("/api/shop/review", shopReviewRouter);

app.use("/api/common/feature", commonFeatureRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})