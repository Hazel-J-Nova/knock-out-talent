const express = require("express");
const router = express.Router();
const multer = require("multer");
const Creators = require("../models/Creators");
const catchAsync = require("../utils/catchAsync");
const creator = require("../controllers/creator");
const { storage } = require("../cloudinary");
const uploadCloudinary = multer({ storage });
const s3Storage = multer.memoryStorage();
const upload = multer({ storage: s3Storage });
router.route("/").get(catchAsync(creator.creatorDashBoard));

router
  .route("/newcontent")
  .get(creator.newContentForm)
  .post(upload.array("content"), catchAsync(creator.uploadNewContent));

router
  .route("/newcontent/image/:id")
  .get(creator.newImageForm)
  .post(uploadCloudinary.array("image"), catchAsync(creator.uploadNewImage));

router.route("/allcontent").get(creator.showAllContent);

module.exports = router;
