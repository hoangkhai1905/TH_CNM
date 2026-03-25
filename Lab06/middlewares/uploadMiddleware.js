const multer = require('multer');

// Luu file vao RAM de day len S3
const storage = multer.memoryStorage();

const upload = multer({ storage });

module.exports = upload;
