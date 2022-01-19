const router = require('express').Router()
const Cart = require('../models/Cart')
const {
	verifyToken,
	verifyTokenWithAuthentication,
	verifyTokenAndAdmin
} = require('../verifyToken')

// CREATE
router.post('/add-cart/', verifyToken, async (req, res) => {
	const newCart = new Cart(req.body)

	try {
		const savedCart = await newCart.save()
		return res.status(200).json(savedCart)
	} catch (error) {
		return res.status(500).json({
			status: 'error',
			error: err
		})
	}
})

// UPDATE
router.put('/update/:id', verifyTokenWithAuthentication, async (req, res) => {
	try {
		const updatedCart = await Cart.findByIdAndUpdate(
			req.params.id,
			{
				$set: req.body
			},
			{ new: true }
		)

		return res.status(200).json(updatedCart)
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
			await Cart.findByIdAndDelete(req.params.id)
			return res.status(200).json({
				status: 'delete',
				message: `the cart ${req.params.id} has been deleted.`
			})
		} catch (err) {
			return res.status(500).json({
				status: 'error',
				error: err
			})
		}
	}
)

// GET USER CART
router.get('/find/:id', async (req, res) => {
	try {
		const cart = await Cart.findOne({ userId: req.params.userId })
		return res.status(200).json(cart)
	} catch (error) {
		return res.status(500).json({
			status: 'error',
			error: err
		})
	}
})

// GET PRODUCT BY ID
router.get('/find/:id', async (req, res) => {
	try {
		const product = await Product.findById(req.params.id)
		return res.status(200).json(product)
	} catch (error) {
		return res.status(500).json({
			status: 'error',
			error: err
		})
	}
})

// GET ALL
router.get('/all-carts/', verifyTokenAndAdmin, async (req, res) => {
	try {
		const carts = await Cart.find()
		return res.status(200).json(carts)
	} catch (err) {
		return res.status(500).json({
			status: 'error',
			error: err
		})
	}
})

module.exports = router
