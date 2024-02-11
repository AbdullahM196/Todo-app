const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: path.join(__dirname, "../Images"),
  filename: function (req, file, cb) {
    console.log(file);
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024,
  },
  fileFilter: function (req, file, cb) {
    //allowed extension
    const fileTypes = /jpeg|jpg|png/;
    //check extName
    const extName = fileTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    //check mime
    const mimeType = fileTypes.test(file.mimetype);
    if (mimeType && extName) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
    }
  },
});

module.exports = upload;
