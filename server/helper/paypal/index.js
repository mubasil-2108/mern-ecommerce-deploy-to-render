
const paypal = require('paypal-rest-sdk');

paypal.configure({
    mode: 'sandbox', //sandbox or live
    client_id: 'Ae7JQ4d5VXjN8y6JY3Ft6KoJb2j5t2Jx1Jt9XZ0j4J6j2J3j0J',
    client_secret: 'Ee7JQ4d5VXjN8y6JY3Ft6KoJb2j5t2Jx1Jt9XZ0j4J6j2J3j0J'
})

module.exports = paypal;