const bodyParser = require('body-parser')
const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()
const testRoute = require('./routes/test')
const userRoute = require('./routes/user')
const authRoutes = require('./routes/auth')
const productRoutes = require('./routes/product')

const app = express()

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

mongoose
	.connect(process.env.MONGO_CONNECTION_STRING)
	.then(() => {
		console.log('✅ connected to the database.')
	})
	.catch(err => {
		console.log(
			`❌ this error occured whilst connecting to the database:${err}`
		)
	})

app.use('/api/server/', testRoute)
app.use('/api/user/', userRoute)
app.use('/api/auth/', authRoutes)
app.use('/api/products/', productRoutes)

const server = app.listen(process.env.SERVER_PORT, () => {
	console.log(`✅ backend server is running on port ${process.env.SERVER_PORT}`)
})

const shutdown = () => {
	console.info('SIGINT signal received.')
	console.log('Closing http server.')
	server.close(() => {
		console.log('Http server closed.')
		// boolean means [force], see in mongoose doc
		mongoose.connection.close(false, () => {
			console.log('MongoDb connection closed.')
			console.log('** graceful system shutdown completed **')
			process.exit(0)
		})
	})
}

process.on('SIGTERM', shutdown)
process.on('SIGINT', shutdown)
