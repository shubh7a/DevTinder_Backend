const express = require("express");

const router = express.Router();

const upload = require("../middlewares/multer");

const cloudinary = require("../utils/cloudinary");

const streamifier = require("streamifier");

router.post(
  "/upload",
  upload.single("photo"),
  async (req, res) => {

    try {

      const streamUpload = () => {

        return new Promise((resolve, reject) => {

          const stream =
            cloudinary.uploader.upload_stream(
              (error, result) => {

                if (result) {
                  resolve(result);
                } else {
                  reject(error);
                }

              }
            );

          streamifier
            .createReadStream(req.file.buffer)
            .pipe(stream);

        });
      };

      const result = await streamUpload();

      res.send({
        imageUrl: result.secure_url,
      });

    } catch (err) {

      console.log(err);

      res.status(500).send("Upload Failed");

    }
  }
);

module.exports = router;