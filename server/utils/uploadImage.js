import cloudinary from 'cloudinary'
async function uploadImageToCloudinary(file, folder, height, width, gravity, crop) {
    const options = { folder };
    if (height) {
        options.height = height;
    }
    if (width) {
        options.width = width;
    }
    if (gravity) {
        options.gravity = gravity
    }
    if (crop) {
        options.crop = crop
    }
    options.resource_type = "auto";
    return await cloudinary.v2.uploader.upload(file.tempFilePath, options);
}
export default uploadImageToCloudinary