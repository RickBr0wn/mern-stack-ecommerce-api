const bodyParser = require('body-parser')
const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()
const testRoute = require('./routes/test')
const userRoute = require('./routes/user')

const app = express()

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

mongoose
	.connect(process.env.MONGO_CONNECTION_STRING)
	.then(() => {
		console.log('✅ you are now connected to the database.')
	})
	.catch(err => {
		console.log(
			`❌ this error occured whilst connecting to the database:${err}`
		)
	})

app.use('/api/server/', testRoute)
app.use('/api/user/', userRoute)

app.listen(process.env.SERVER_PORT, () => {
	console.log(`✅ backend server is running on port ${process.env.SERVER_PORT}`)
})
