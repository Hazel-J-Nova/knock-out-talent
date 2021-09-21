const multer = require("multer");
const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const content = require("../controllers/content");
const admin = require("../controllers/admin")
const {s3Storage} = require("../aws/aws")
const upload = multer({ s3Storage })


router.route('/')
    .get(catchAsync(admin.adminDashBoard))



router.route("/newcontent")
    .get(admin.newContentForm)
    .post(upload.array("image"), catchAsync(admin.uploadNewContent))


router.route("/allcontent")
    .get(admin.showAllContent)

module.exports = router;

