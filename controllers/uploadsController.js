const path = require('path')
const { StatusCodes } = require('http-status-codes')
const customError = require('../errors')
const fs = require('fs')
const cloudinary = require('cloudinary').v2

const uploadImageLocal = async (req, res) => {
  if (!req.files) {
    throw new customError.BadRequestError('No file found')
  }
  const imagePath = req.files.image
  const maxSize = 1024 * 1024

  if (!imagePath.mimetype.startsWith('image')) {
    throw new customError.BadRequestError('Please upload a image')
  }

  if (imagePath.size >= maxSize) {
    throw new customError.BadRequestError(
      'Please upload image with size less than 1mb'
    )
  }

  console.log(imagePath.size)

  const uploadPath = path.resolve(
    __dirname,
    '../public/uploads/' + `${imagePath.name}`
  )
  await imagePath.mv(uploadPath)

  res
    .status(StatusCodes.OK)
    .json({ image: { src: `/uploads/${imagePath.name}` } })
}

const uploadImage = async (req, res) => {
  console.log(req.files.image)
  const result = await cloudinary.uploader.upload(
    req.files.image.tempFilePath,
    {
      use_filename: true,
      folder: 'file-upload',
    }
  )
  fs.unlinkSync(req.files.image.tempFilePath)
  res.status(StatusCodes.OK).json({ image: { src: result.secure_url } })
}

module.exports = {
  uploadImage,
}
