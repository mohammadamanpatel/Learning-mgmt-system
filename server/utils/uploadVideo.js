import cloudinary from 'cloudinary'

// Cloudinary's Free plan caps a single video asset at 100 MB.
export const MAX_VIDEO_BYTES = 100 * 1024 * 1024;

/**
 * Uploads a lecture video.
 *
 * Videos go through upload_large (chunked) rather than upload: the plain upload
 * endpoint takes the whole file in one request and answers 413 once it gets big.
 * No width/height either — those are image crop params, and asking Cloudinary to
 * transform the video while ingesting it is what made this take ~37s.
 */
function uploadVideoToCloudinary(file, folder) {
    return new Promise((resolve, reject) => {
        // upload_large returns a stream, not a promise, so it has to be wrapped.
        cloudinary.v2.uploader.upload_large(
            file.tempFilePath,
            {
                folder,
                resource_type: 'video',
                chunk_size: 6 * 1024 * 1024
            },
            (error, result) => {
                if (error) return reject(error);
                if (!result?.public_id || !result?.secure_url) {
                    return reject(new Error('Cloudinary returned no asset for the video'));
                }
                resolve(result);
            }
        );
    });
}

export default uploadVideoToCloudinary
