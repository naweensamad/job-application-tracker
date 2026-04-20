const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { findUserByEmail, createUser } = require('../models/User')

const register = async (req, res) => {
    try {
        const { email, password } = req.body

        const existingUser = await findUserByEmail(email)
        if (existingUser) {
            return res.status(400).json({ message: 'Email already in use' })
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await createUser(email, hashedPassword)

        return res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: user.id,
                email: user.email
            }
        })
    } catch (err) {
        console.error('Register error:', err)
        return res.status(500).json({ message: 'Server error' })
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body

        const existingUser = await findUserByEmail(email)
        if (!existingUser) {
            return res.status(400).json({ message: 'User not found' })
        }

        const isMatch = await bcrypt.compare(password, existingUser.password)
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' })
        }

        const token = jwt.sign(
            { id: existingUser.id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        )

        return res.json({ token })
    } catch (err) {
        console.error('Login error:', err)
        return res.status(500).json({ message: 'Server error' })
    }
}

module.exports = { register, login }