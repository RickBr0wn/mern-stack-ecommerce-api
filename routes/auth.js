const router = require('express').Router()
const User = require('../models/User')
const CryptoJS = require('crypto-js')
const jwt = require('jsonwebtoken')

// register
router.post('/register', async (req, res) => {
	const newUser = new User({
		username: req.body.username,
		email: req.body.email,
		password: CryptoJS.AES.encrypt(
			req.body.password,
			process.env.CRYPTO_JS_SECRET_KEY
		).toString(),
		username: req.body.username
	})

	try {
		const savedUser = await newUser.save()
		return res.status(201).json(savedUser)
	} catch (err) {
		return res.status(500).json({
			status: 'error',
			error: err
		})
	}
})

// login
router.post('/login', async (req, res) => {
	try {
		const user = await User.findOne({ username: req.body.username })

		if (!user) {
			return res
				.status(401)
				.json({ status: 'error', error: 'Wrong credentials' })
		}

		const hashedPassword = CryptoJS.AES.decrypt(
			user.password,
			process.env.CRYPTO_JS_SECRET_KEY
		).toString(CryptoJS.enc.Utf8)

		if (hashedPassword !== req.body.password) {
			return res
				.status(401)
				.json({ status: 'error', error: 'Wrong credentials' })
		}

		const accessToken = jwt.sign(
			{
				id: user.id,
				isAdmin: user.isAdmin
			},
			process.env.JWT_SECRET_KEY,
			{ expiresIn: '3d' }
		)

		//remove the password from the object
		const { password, ...objectWithoutPassword } = user._doc

		return res.status(200).json({ ...objectWithoutPassword, accessToken })
	} catch (err) {
		return res.status(500).json({
			status: 'error',
			error: err
		})
	}
})

module.exports = router
