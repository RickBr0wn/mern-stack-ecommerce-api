const router = require('express').Router()
const User = require('../models/User')
const {
	verifyToken,
	verifyTokenWithAuthentication,
	verifyTokenAndAdmin
} = require('../verifyToken')

// UPDATE
router.put('/update/:id', verifyTokenAndAdmin, async (req, res) => {
	if (req.body.password) {
		req.body.password = CryptoJS.AES.encrypt(
			req.body.password,
			process.env.CRYPTO_JS_SECRET_KEY
		).toString()
	}

	try {
		const updatedUser = await User.findByIdAndUpdate(
			req.params.id,
			{
				$set: req.body
			},
			{ new: true }
		)

		return res.status(200).json(updatedUser)
	} catch (err) {
		return res.status(500).json({
			status: 'error',
			error: err
		})
	}
})

// DELETE
router.delete(
	'/delete/:id',
	verifyTokenWithAuthentication,
	async (req, res) => {
		try {
			await User.findByIdAndDelete(req.params.id)
			return res.status(200).json({
				status: 'delete',
				message: `the user ${req.params.id} has been deleted.`
			})
		} catch (err) {
			return res.status(500).json({
				status: 'error',
				error: err
			})
		}
	}
)

// GET
router.get('/find/:id', verifyTokenAndAdmin, async (req, res) => {
	try {
		const user = await User.findById(req.params.id)
		const { password, ...objectWithoutPassword } = user._doc

		return res.status(200).json({
			status: 'get',
			user: { ...objectWithoutPassword }
		})
	} catch (err) {
		return res.status(500).json({
			status: 'error',
			error: err
		})
	}
})

// GET ALL USERS
router.get('/all-users/', verifyTokenAndAdmin, async (req, res) => {
	const query = req.query.new

	try {
		const usersWithPasswords = query
			? await User.find().sort({ _id: -1 }).limit(1)
			: await User.find()

		const users = usersWithPasswords.map(user => {
			const { password, ...objectWithoutPassword } = user._doc
			return { ...objectWithoutPassword }
		})

		return res.status(200).json({
			status: 'get',
			users: users
		})
	} catch (err) {
		return res.status(500).json({
			status: 'error',
			error: err
		})
	}
})

// GET USER STATS
router.get('/stats/', verifyTokenAndAdmin, async (req, res) => {
	const date = new Date()
	const lastYear = new Date(date.setFullYear(date.getFullYear() - 1))

	try {
		const data = await User.aggregate([
			{ $match: { createdAt: { $gte: lastYear } } },
			{
				$project: {
					month: { $month: '$createdAt' }
				}
			},
			{
				$group: {
					_id: '$month',
					total: { $sum: 1 }
				}
			}
		])
		return res.status(200).json(data)
	} catch (error) {
		return res.status(500).json({
			status: 'error',
			error: err
		})
	}
})

module.exports = router
