const jwt = require('jsonwebtoken')

const verifyToken = (req, res, next) => {
	const authHeader = req.headers.authorization

	if (authHeader) {
		const token = authHeader.toString().split(' ')[1]

		jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
			if (err) {
				return res.status(403).json({
					status: 'error',
					error: 'token invalid',
					token
				})
			}
			req.user = user
			next()
		})
	} else {
		return res.status(401).json({
			status: 'error',
			error: 'no authorization credentials found in header',
			token
		})
	}
}

const verifyTokenWithAuthentication = (req, res, next) => {
	verifyToken(req, res, () => {
		console.log(req.user)

		if (req.user.id === req.params.id) {
			next()
		} else {
			return res.status(403).json({
				status: 'error',
				error: 'not authenticated'
			})
		}
	})
}

const verifyTokenAndAdmin = (req, res, next) => {
	verifyToken(req, res, () => {
		if (req.user.isAdmin) {
			next()
		} else {
			return res.status(403).json({
				status: 'error',
				error: 'not admin'
			})
		}
	})
}

module.exports = {
	verifyToken,
	verifyTokenWithAuthentication,
	verifyTokenAndAdmin
}
