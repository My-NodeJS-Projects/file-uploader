require('dotenv').config()
require('express-async-errors')

const express = require('express')
const app = express()

// database
const connectDB = require('./db/connect')

//router
const productRouter = require('./routes/productRoutes')
// error handler
const notFoundMiddleware = require('./middleware/not-found')
const errorHandlerMiddleware = require('./middleware/error-handler')

const fileupload = require('express-fileupload')
const cloudinary = require('cloudinary').v2

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
})

app.use(express.json())
app.use(
  fileupload({
    useTempFiles: true,
  })
)
app.use(express.static('./public'))

app.get('/', (req, res) => {
  res.send('<h1>File Upload Starter</h1>')
})

// routes
app.use('/api/v1/products', productRouter)
// middleware
app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const port = process.env.PORT || 3000

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)

    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    )
  } catch (error) {
    console.log(error)
  }
}

start()
