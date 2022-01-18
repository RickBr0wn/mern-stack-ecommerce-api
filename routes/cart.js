const router = require('express').Router()

router.get('/', (req, res) => {
	res.json({ message: '' })
})

module.exports = router
