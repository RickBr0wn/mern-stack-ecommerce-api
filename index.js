const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()

const app = express()

mongoose
	.connect(process.env.MONGO_CONNECTION_STRING)
	.then(() => {
		console.log('Success! You are now connected to the database.')
	})
	.catch(err => {
		console.log(
			`Failure! This error occured whilst connecting to the database:${err}`
		)
	})

app.listen(process.env.SERVER_PORT, () => {
	console.log(`Backend server is running on port ${process.env.SERVER_PORT}`)
})
