const multer = require('multer');

const fileFilter = (req, file, cb) => {
    if (
        file.mimetype.startsWith('image/') || // Images
        file.mimetype.startsWith('video/')  // Videos
        // file.mimetype === 'application/pdf' || // PDFs
        // file.mimetype === 'text/csv' || // CSVs
        // file.mimetype === 'application/vnd.ms-excel' // Excel
    ) {
        cb(null, true);
    } else {
        cb(new Error('Please upload only images, or videos.'), false);
    }
};

const storage = multer.memoryStorage(); // Store file in memory

const uploadFile = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 1000 }, // set max file size to 1000MB
    fileFilter: fileFilter,
});

module.exports = uploadFile;
