const multer = require("multer");
const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const content = require("../controllers/content");
const admin = require("../controllers/admin")

const { storage } = require('../cloudinary');
const uploadCloudinary = multer({ storage });
const s3Storage = multer.memoryStorage()
const upload = multer({ storage: s3Storage })
router.route('/')
    .get(catchAsync(admin.adminDashBoard))



router.route("/newcontent")
    .get(admin.newContentForm)
    .post(upload.array("content"), catchAsync(admin.uploadNewContent))


router.route("/newcontent/image/:id")
    .get(admin.newImageForm)
    .post(uploadCloudinary.array("image"), catchAsync(admin.uploadNewImage))


router.route("/allcontent")
    .get(admin.showAllContent)

module.exports = router;

