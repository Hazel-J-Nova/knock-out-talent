const multer = require("multer");
const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const content = require("../controllers/content");
const admin = require("../controllers/admin")
const {s3Storage} = require("../aws/aws")
const upload = multer({ s3Storage })
const { storage } = require('../cloudinary');
const uploadCloudinary = multer({ storage });

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

