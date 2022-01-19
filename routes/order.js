const router = require('express').Router()
const Order = require('../models/Order')
const {
	verifyToken,
	verifyTokenWithAuthentication,
	verifyTokenAndAdmin
} = require('../verifyToken')

// CREATE
router.post('/add-order/', verifyTokenAndAdmin, async (req, res) => {
	const newOrder = new Order(req.body)

	try {
		const savedOrder = await newOrder.save()
		return res.status(200).json(savedOrder)
	} catch (error) {
		return res.status(500).json({
			status: 'error',
			error: error
		})
	}
})

// UPDATE
router.put('/update/:id', verifyTokenAndAdmin, async (req, res) => {
	try {
		const updatedOrder = await Order.findByIdAndUpdate(
			req.params.id,
			{
				$set: req.body
			},
			{ new: true }
		)

		return res.status(200).json(updatedOrder)
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
		await Order.findByIdAndDelete(req.params.id)
		return res.status(200).json({
			status: 'delete',
			message: `the order ${req.params.id} has been deleted.`
		})
	} catch (err) {
		return res.status(500).json({
			status: 'error',
			error: err
		})
	}
})

// GET USER ORDER
router.get('/find/:id', verifyTokenWithAuthentication, async (req, res) => {
	try {
		const orders = await Order.findById(req.params.id)
		return res.status(200).json(orders)
	} catch (error) {
		return res.status(500).json({
			status: 'error',
			error: err
		})
	}
})

// GET ALL ORDERS
router.get('/all-orders/', verifyTokenAndAdmin, async (req, res) => {
	try {
		const orders = await Order.find()
		return res.status(200).json(orders)
	} catch (err) {
		return res.status(500).json({
			status: 'error',
			error: err
		})
	}
})

// GET MONTHLY INCOME
// FIXME: Bugged when current month is 1 or 2.
// Moves the month correctly to 11 & 12 respectively but does not change the year.
router.get('/income', verifyTokenAndAdmin, async (req, res) => {
	const date = new Date()
	const lastMonth = new Date(date.setMonth(date.getMonth() - 1))
	const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1))
	console.log(previousMonth)

	try {
		const income = await Order.aggregate([
			{ $match: { createdAt: { $gte: previousMonth } } },
			{
				$project: {
					month: { $month: '$createdAt' },
					sales: '$amount'
				}
			},
			{
				$group: {
					_id: '$month',
					total: { $sum: '$sales' }
				}
			}
		])
		res.status(200).json(income)
	} catch (err) {
		return res.status(500).json({
			status: 'error',
			error: err
		})
	}
})

module.exports = router
