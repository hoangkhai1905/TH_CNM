const { S3Client } = require('@aws-sdk/client-s3');
const { Upload } = require('@aws-sdk/lib-storage');
const path = require('path');

const s3Client = new S3Client({
    region: process.env.AWS_REGION ? process.env.AWS_REGION : 'ap-southeast-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});

async function uploadFile(file) {
    if (!file) return null;

    // Sanitize filename: remove spaces and special chars, keep extension
    const sanitizedOriginalName = file.originalname.replace(/[^a-zA-Z0-9.]/g, '_');
    const fileName = `products/${Date.now()}-${sanitizedOriginalName}`;

    try {
        const upload = new Upload({
            client: s3Client,
            params: {
                Bucket: process.env.AWS_S3_BUCKET_NAME,
                Key: fileName,
                Body: file.buffer,
                ContentType: file.mimetype,
                // Try to make it public. Note: Bucket must allow public ACLs.
                // If this fails with AccessDenied, the bucket blocks public ACLs.
                // For a lab, we assume public access is desired.
                // ACL: 'public-read' // Commented out by default to avoid crash if bucket blocks it.
                // We'll rely on the user checking bucket settings or use signed URLs in future.
            },
        });

        const result = await upload.done();
        console.log('S3 Upload Success. Location:', result.Location);
        return result.Location; // Returns the URL
    } catch (error) {
        console.error('S3 Upload Error:', error);
        throw error;
    }
}

const { GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

/**
 * Generates a presigned URL for a file in S3
 * @param {string} fileUrl - The full S3 URL stored in DB
 * @returns {Promise<string>} - The presigned URL
 */
async function getFileSignedUrl(fileUrl) {
    if (!fileUrl) return null;

    try {
        // Extract Key from URL
        // Example URL: https://bucket-name.s3.region.amazonaws.com/products/filename.jpg
        // We need 'products/filename.jpg'

        let key;
        const bucketUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/`;
        const bucketUrl2 = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.amazonaws.com/`; // Some regions format

        if (fileUrl.startsWith(bucketUrl)) {
            key = fileUrl.replace(bucketUrl, '');
        } else if (fileUrl.startsWith(bucketUrl2)) {
            key = fileUrl.replace(bucketUrl2, '');
        } else {
            // Fallback: split by bucket name if possible or just try to grab the path
            const parts = fileUrl.split(process.env.AWS_S3_BUCKET_NAME);
            if (parts.length > 1) {
                // .../bucketname/key
                // This is tricky if the URL format is different. 
                // Let's assume standard format for now.
                // If we can't parse it, return original.
                // It might be easier if we stored Key in DB, but we stored URL.

                // Let's try URL object
                try {
                    const urlObj = new URL(fileUrl);
                    // Pathname includes leading slash, e.g. /products/file.jpg
                    key = urlObj.pathname.substring(1);
                } catch (e) {
                    return fileUrl;
                }
            } else {
                return fileUrl;
            }
        }

        const command = new GetObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: key,
        });

        // URL expires in 1 hour (3600 seconds)
        const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
        return signedUrl;
    } catch (error) {
        console.error('Error signing URL:', error);
        return fileUrl; // Fallback to original
    }
}

module.exports = { uploadFile, getFileSignedUrl };
