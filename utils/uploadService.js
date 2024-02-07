const { uploadtocloudinary, deleteFromCloudinary } = require('../middlewares/cloudinary');
const { generateRandomString } = require('../stringGenerators');

const uploadSingleFile = async (file) => {
    const fileBuffer = file.buffer;
    const originalname = file.originalname;
    const details = {
        name: await generateRandomString(6),
    };

    const uploadresult = await uploadtocloudinary(fileBuffer, details);
    if (uploadresult.message === 'error') {
        throw new Error(uploadresult.error.message);
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
        throw new Error(`Error uploading files to cloudinary`);
    }

    return results;
};

const deleteFiles = async (urls) => {
    if (!urls || !urls.length) {
        throw new Error('No URLs found for deletion');
    }

    const deletePromises = urls.map((url) => deleteFromCloudinary(url));
    const results = await Promise.all(deletePromises);

    if (results.length === 0) {
        throw new Error(`Error deleting files from cloudinary`);
    }

    return results;
};

module.exports = {
    uploadSingleFile,
    uploadFiles,
    deleteFiles,
};
