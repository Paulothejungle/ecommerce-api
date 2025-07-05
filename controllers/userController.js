const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (user) { return res.status(400).json({ message: 'email sudah terdaftar' }); }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({ name, email, password: hashedPassword });
        await user.save();

        res.status(201).json({ message: 'registrasi berhasil' })
    } catch(error) {
        res.status(500).send('Server error');
    }
}

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (!user) { return res.status(400).json({ message: 'email tidak valid' }) };

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) { return res.status(400).json({ message: 'password tidak valid' }) };

        const payload = { user: {id: user.id } };
        const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: '1h' });

        res.json({ token })
    } catch (error) {
        res.status(500).send('Server error')
    }   
}

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'server error' })
    }
}

module.exports = {
    registerUser,
    loginUser,
    getAllUsers
}