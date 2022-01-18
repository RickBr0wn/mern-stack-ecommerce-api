const router = require('express').Router()

router.get('/test/get', (req, res) => {
	res.json({ message: '✅ server is running.' })
})

router.post('/test/post', (req, res) => {
	res.json({ message: req.body.username })
})

module.exports = router
