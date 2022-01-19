const router = require('express').Router()
const Product = require('../models/Product')
const {
	verifyToken,
	verifyTokenWithAuthentication,
	verifyTokenAndAdmin
} = require('../verifyToken')

// CREATE
router.post('/add-product/', verifyTokenAndAdmin, async (req, res) => {
	const newProduct = new Product(req.body)

	try {
		const savedProduct = await newProduct.save()
		return res.status(200).json(savedProduct)
	} catch (error) {
		return res.status(500).json({
			status: 'error',
			error: err
		})
	}
})

// UPDATE
router.put('/update/:id', verifyTokenAndAdmin, async (req, res) => {
	try {
		const updatedProduct = await Product.findByIdAndUpdate(
			req.params.id,
			{
				$set: req.body
			},
			{ new: true }
		)

		return res.status(200).json(updatedProduct)
	} catch (err) {
		return res.status(500).json({
			status: 'error',
			error: err
		})
	}
})

// DELETE
router.delete('/delete/:id', verifyTokenAndAdmin, async (req, res) => {
	try {
		await Product.findByIdAndDelete(req.params.id)
		return res.status(200).json({
			status: 'delete',
			message: `the product ${req.params.id} has been deleted.`
		})
	} catch (err) {
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

// GET ALL PRODUCTS
router.get('/all-products/', async (req, res) => {
	const queryNew = req.query.new
	const queryCategory = req.query.category

	try {
		let products = []
		if (queryNew) {
			products = await Product.find().sort({ createdAt: -1 }).limit(5)
		} else if (queryCategory) {
			products = await Product.find({
				categories: { $in: [queryCategory] }
			}).sort({ createdAt: -1 })
		} else {
			products = await Product.find().sort({ createdAt: -1 })
		}
		res.status(200).json(products)
	} catch (err) {
		return res.status(500).json({
			status: 'error',
			error: err
		})
	}
})

// router.get('/', (req, res) => {
// 	res.json({ message: '' })
// })

module.exports = router
