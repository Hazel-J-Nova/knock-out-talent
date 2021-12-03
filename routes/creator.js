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

router.route("/:creatorname").get(creator.renderCreatorPage);

module.exports = router;
