const multer = require("multer");
const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const admin = require("../controllers/admin");
const { checkAdmin, isCreator } = require("../utils/middleware");

const { storage } = require("../cloudinary");
const uploadCloudinary = multer({ storage });
const s3Storage = multer.memoryStorage();
const upload = multer({ storage: s3Storage });

router.route("/").get(catchAsync(admin.adminDashBoard));

router
  .route("/newcontent")
  .get(isCreator, catchAsync(admin.newContentForm))
  .post(upload.array("content"), isCreator, catchAsync(admin.uploadNewContent));

router
  .route("/newcontent/image/:id")
  .get(catchAsync(admin.newImageForm))
  .post(
    uploadCloudinary.array("image"),
    isCreator,
    catchAsync(admin.uploadNewImage)
  );

router.route("/allcontent").get(admin.showAllContent);

router
  .route("/verifyCreator")
  .get(checkAdmin, catchAsync(admin.verifyCreatorList));

router
  .route("/verifyCreator/:creatorId")
  .post(checkAdmin, catchAsync(admin.verifyCreator));

router
  .route("/email")
  .get(checkAdmin, admin.renderEmailForm)
  .post(checkAdmin, catchAsync(admin.emailForm));

router.route("/allEmail").get(checkAdmin, catchAsync(admin.allEmail));

router
  .route("/email/:emailId/delete")
  .post(checkAdmin, catchAsync(admin.deleteEmail));
module.exports = router;

router
  .route("/email:emailId/update")
  .get(checkAdmin, catchAsync(admin.updateEmailForm))
  .post(checkAdmin, catchAsync(admin.updateEmail));
