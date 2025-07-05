const Product = require('../models/productModel');

const getAllProducts = async (req, res) => {
    try{
        const products = await Product.find({});
        res.json(products);
    } catch(error) {
        console.error(error);
        res.status(500).json({ message: 'server error' });
    }
}

const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if(product){
            res.json(product)
        } else {
            res.status(400).json({ message: 'produk tidak ditemukan' })
        }
    } catch(error) {
        console.error(error);
        res.status(500).json({ message: 'server error' })
    }
}

const createProduct = async (req, res) => {
    const { name, description, price, stock } = req.body;

    try {
        const product = new Product({
            name,
            description,
            price,
            stock,
        });
        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch(error) {
        console.error(error)
        res.status(500).json({ message: 'server error' })
    }
}

const updateProduct = async (req, res) => {
    const { name, description, price, stock } = req.body;
    try{
        const product = await Product.findById(req.params.id);
        if (product) {
            product.name = name || product.name;
            product.description = description || product.description;
            product.price = price || product.price;
            product.stock = stock !== undefined ? stock : product.stock;

            const updatedProduct = await product.save();
            res.status(200).json(updatedProduct);
        } else {
            res.status(404).json({ message: 'produk tidak ditemukan' })
        }
    } catch(error) {
        console.error(error);
        res.status(500).json({ message: 'server error' });
    }
}

const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if (product) {
            res.status(200).json({ message: 'produk berhasil dihapus' });
        } else {
            res.status(404).json({ message: 'produk tidak ditemukan' })
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'server error' })
    }
}

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
}