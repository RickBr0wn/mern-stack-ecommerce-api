const router = require('express').Router()

router.get('/test', (req, res) => {
	res.json({ message: '✅ server is running.' })
})

module.exports = router
