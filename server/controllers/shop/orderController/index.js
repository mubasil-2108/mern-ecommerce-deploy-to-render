const paypal = require('../../../helper/paypal')
const Order = require('../../../models/order')
const Cart = require('../../../models/cart')
const Product = require('../../../models/products')

const createOrder = async (req, res) => {
    try {
        const {
            userId,
            cartItems,
            addressInfo,
            orderStatus,
            paymentMethode,
            paymentStatus,
            totalAmount,
            orderDate,
            orderUpdateDate,
            paymentId,
            payerId,
            cartId } = req.body;

        const create_payment_json = {
            intent: "sale",
            payer: {
                payment_method: "paypal"
            },
            redirect_urls: {
                return_url: `${process.env.CLIENT_BASE_URL}/shop/paypal-return`,
                cancel_url: `${process.env.CLIENT_BASE_URL}/shop/paypal-cancel`
            },
            transactions: [
                {
                    item_list: {
                        items: cartItems.map(item => ({
                            name: item.title,
                            sku: item.productId,
                            price: item.price.toFixed(2),
                            currency: "USD",
                            quantity: item.quantity
                        }))
                    },
                    amount: {
                        currency: "USD",
                        total: totalAmount.toFixed(2)
                    },
                    description: "This is the payment description"
                }
            ]
        }
        paypal.payment.create(create_payment_json, async (error, paymentInfo) => {
            if (error) {
                console.log(error);
                return res.status(500).json({
                    success: false,
                    message: "Error while creating payment"
                });
            } else {
                const newlyCreatedOrder = new Order({
                    userId,
                    cartId,
                    cartItems,
                    addressInfo,
                    orderStatus,
                    paymentMethode,
                    paymentStatus,
                    totalAmount,
                    orderDate,
                    orderUpdateDate,
                    paymentId,
                    payerId
                })

                await newlyCreatedOrder.save();

                const approvalURL = paymentInfo.links.find(link => link.rel === "approval_url").href;
                return res.status(201).json({
                    success: true,
                    approvalURL,
                    orderId: newlyCreatedOrder._id
                })
            }
        })

    } catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
}



const capturePayment = async (req, res) => {
    try {
        const { orderId, paymentId, payerId } = req.body;

        let order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            })
        }
        order.paymentStatus = 'paid';
        order.orderStatus = 'confirmed';
        order.paymentId = paymentId;
        order.payerId = payerId;

        for(let item of order.cartItems){
            let product = await Product.findById(item.productId);

            if(!product){
                return res.status(404).json({
                    success: false,
                    message: `Not enough stock for this product ${product.title}`
                })
            }
            product.totalStock -= item.quantity;

            await product.save();
        }

        const getCartId = order.cartId;
        await Cart.findByIdAndDelete(getCartId);
        await order.save();

        res.status(200).json({
            success: true,
            message: "Payment captured successfully",
            data: order
        })

    } catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
}

const getAllOrdersByUser = async (req, res) => {
    try {

        const {userId} = req.params;
        const orders = await Order.find({userId});

        if(!orders.length){
            return res.status(404).json({
                success: false,
                message: "No orders found"
            })           
        }

        res.status(200).json({
            success: true,
            data: orders
        })

    }catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
}

const getOrdersDetails = async (req, res) => {
    try {

        const {id} = req.params;

        const order = await Order.findById(id);

        if(!order){
            return res.status(404).json({
                success: false,
                message: "Order not found"
            })           
        }

        res.status(200).json({
            success: true,
            data: order
        })
    }catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
}

module.exports = { createOrder, capturePayment, getAllOrdersByUser, getOrdersDetails };