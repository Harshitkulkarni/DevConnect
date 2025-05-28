const cloudinary = require("cloudinary").v2;
const fs = require("fs");

cloudinary.config({
  cloud_name: "dw5dqjqdl",
  api_key: "444812981411761",
  api_secret: process.env.CLOUDINARY_KEY,
});

const uploadTocloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    const uploadedResponse = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    fs.unlinkSync(localFilePath);

    return uploadedResponse;
  } catch (error) {
    console.error("Upload Failed:", error);
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    return null;
  }
};

module.exports = { uploadTocloudinary };
