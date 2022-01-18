const router = require('express').Router()
const User = require('../models/User')
const CryptoJS = require('crypto-js')

// register
router.post('/register', async (req, res) => {
	const newUser = new User({
		username: req.body.username,
		email: req.body.email,
		password: CryptoJS.AES.encrypt(
			req.body.password,
			process.env.SECRET_KEY
		).toString(),
		username: req.body.username
	})

	try {
		const savedUser = await newUser.save()
		res.status(201).json(savedUser)
		return
	} catch (err) {
		res.status(500).json({
			status: 'error',
			error: err
		})
		return
	}
})

// login
router.post('/login', async (req, res) => {
	try {
		const user = await User.findOne({ username: req.body.username })

		if (!user) {
			res.status(401).json({ status: 'error', error: 'Wrong credentials' })
			return
		}

		const hashedPassword = CryptoJS.AES.decrypt(
			user.password,
			process.env.SECRET_KEY
		).toString(CryptoJS.enc.Utf8)

		if (hashedPassword !== req.body.password) {
			res.status(401).json({ status: 'error', error: 'Wrong credentials' })
			return
		}

		//remove the password from the object
		const { password, ...objectWithoutPassword } = user._doc

		res.status(200).json(objectWithoutPassword)
		return
	} catch (err) {
		res.status(500).json({
			status: 'error',
			error: err
		})
		return
	}
})

module.exports = router
