const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/img/");
  },
  filename: (req, file, cb) => {
    let extension = file.mimetype;
    extension = extension.substring(
      extension.indexOf("/") + 1,
      extension.length
    );
    let filename = file.fieldname + "-" + Date.now() + "." + extension;
    cb(null, filename);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

exports.upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});
