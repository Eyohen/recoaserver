const { uploadtocloudinary, deleteFromCloudinary } = require('../middlewares/cloudinary');
const { generateRandomString } = require('./stringGenerators');

const uploadSingleFile = async (file) => {
    const fileBuffer = file.buffer;
    const originalname = file.originalname;
    const details = {
        name: await generateRandomString(6),
    };

    const uploadresult = await uploadtocloudinary(fileBuffer, details);
    if (uploadresult.message === 'error') {
        return res.status(400).json(uploadresult.error.message);
    }
    if (uploadresult.message === 'success') {
        return uploadresult.url;
    }
};

const uploadFiles = async (req) => {
    const files = req.files;

    const uploadPromises = files.map((file) => uploadSingleFile(file));
    const results = await Promise.all(uploadPromises);

    if (results.length === 0) {
        return res.status(400).json(`Error uploading files to cloudinary`);
    }

    return results;
};

const deleteFiles = async (urls) => {
    if (!urls || !urls.length) {
        return res.status(400).json('No URLs found for deletion');
    }

    const deletePromises = urls.map((url) => deleteFromCloudinary(url));
    const results = await Promise.all(deletePromises);

    if (results.length === 0) {
        return res.status(400).json(`Error deleting files from cloudinary`);
    }

    return results;
};

module.exports = {
    uploadSingleFile,
    uploadFiles,
    deleteFiles,
};
