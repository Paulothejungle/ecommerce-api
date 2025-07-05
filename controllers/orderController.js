const Order = require('../models/orderModel');
const Product = require('../models/productModel');

const createOrder = async (req, res) => {
    const { products } = req.body;

    try {
        if (!products || products.length === 0) {
            return res.status(400).json({ message: "keranjang belanja kosong" })
        }

        let totalAmount = 0;
        const orderProducts = [];

        for (const item of products) {
            const product = await Product.findById(item.product);
            if (!product) {
                return res.status(404).json({ message: `produk dengan id${item.product} tidak ditemukan` });
            }
            if (product.stock < item.quantity) {
                return res.status(404).json({ message: `stok produk ${product.name} tidak ditemukan` });
            }

            totalAmount += product.price * item.quantity;
            orderProducts.push({ product: item.product, quantity: item.quantity });

            product.stock -= item.quantity;
            await product.save();
        }
        const order = new Order({
            user: req.user.id,
            products: orderProducts,
            totalAmount,
        });
        const createOrder = await order.save();
        res.status(201).json(createOrder);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'server error' });
    }
};

const getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id }).populate(
            'products.product',
            'name price'
        );
        if (!orders) {
            return res.status(404).json({ message: 'anda belum memiliki pesanan' })
        }

        res.json(orders); 
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'server error' })
    }
}

module.exports = {
    createOrder,
    getUserOrders
}
