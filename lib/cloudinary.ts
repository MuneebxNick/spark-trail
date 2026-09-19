import { v2 as cloudinary } from 'cloudinary'

const cloudName = process.env.CLOUDINARY_CLOUD_NAME
const apiKey = process.env.CLOUDINARY_API_KEY
const apiSecret = process.env.CLOUDINARY_API_SECRET

export const isCloudinaryConfigured = Boolean(cloudName && apiKey && apiSecret)

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  })
}

export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024 // 5MB
export const ALLOWED_IMAGE_TYPES = [
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp',
  'image/gif',
]

/**
 * Uploads an image buffer or data URI to Cloudinary in the 'sparktrail/trails' folder.
 * Returns the persistent secure HTTPS URL.
 */
export async function uploadTrailImageToCloudinary(
  dataUriOrBase64: string
): Promise<{ url: string; publicId: string }> {
  if (!isCloudinaryConfigured) {
    throw new Error(
      'Cloudinary is not configured. Missing CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, or CLOUDINARY_API_SECRET.'
    )
  }

  // Server-side validation of data URI format if applicable
  if (dataUriOrBase64.startsWith('data:')) {
    const mimeMatch = dataUriOrBase64.match(/^data:([^;]+);base64,/)
    if (mimeMatch) {
      const mime = mimeMatch[1].toLowerCase()
      if (!ALLOWED_IMAGE_TYPES.includes(mime)) {
        throw new Error(
          `Invalid image type (${mime}). Supported types: PNG, JPG, JPEG, WEBP, GIF.`
        )
      }
    }

    // Estimate file size from base64 string length
    const base64Data = dataUriOrBase64.split(',')[1] || ''
    const approximateSizeBytes = (base64Data.length * 3) / 4
    if (approximateSizeBytes > MAX_IMAGE_SIZE_BYTES) {
      throw new Error('Image exceeds the maximum allowed size of 5MB.')
    }
  }

  const result = await cloudinary.uploader.upload(dataUriOrBase64, {
    folder: 'sparktrail/trails',
    resource_type: 'image',
    allowed_formats: ['png', 'jpg', 'jpeg', 'webp', 'gif'],
    transformation: [
      { quality: 'auto', fetch_format: 'auto' },
      { max_width: 2400, crop: 'limit' },
    ],
  })

  return {
    url: result.secure_url,
    publicId: result.public_id,
  }
}

/**
 * Uploads an avatar image to Cloudinary in the 'sparktrail/avatars' folder.
 * Crops to square and limits to 400x400 px.
 */
export async function uploadAvatarToCloudinary(
  dataUriOrBase64: string
): Promise<{ url: string; publicId: string }> {
  if (!isCloudinaryConfigured) {
    throw new Error(
      'Cloudinary is not configured. Missing CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, or CLOUDINARY_API_SECRET.'
    )
  }

  // Server-side validation of data URI format if applicable
  if (dataUriOrBase64.startsWith('data:')) {
    const mimeMatch = dataUriOrBase64.match(/^data:([^;]+);base64,/)
    if (mimeMatch) {
      const mime = mimeMatch[1].toLowerCase()
      if (!ALLOWED_IMAGE_TYPES.includes(mime)) {
        throw new Error(
          `Invalid image type (${mime}). Supported types: PNG, JPG, JPEG, WEBP, GIF.`
        )
      }
    }

    // Estimate file size from base64 string length
    const base64Data = dataUriOrBase64.split(',')[1] || ''
    const approximateSizeBytes = (base64Data.length * 3) / 4
    if (approximateSizeBytes > MAX_IMAGE_SIZE_BYTES) {
      throw new Error('Image exceeds the maximum allowed size of 5MB.')
    }
  }

  const result = await cloudinary.uploader.upload(dataUriOrBase64, {
    folder: 'sparktrail/avatars',
    resource_type: 'image',
    allowed_formats: ['png', 'jpg', 'jpeg', 'webp', 'gif'],
    transformation: [
      { width: 400, height: 400, crop: 'fill', gravity: 'face' },
      { quality: 'auto', fetch_format: 'auto' },
    ],
  })

  return {
    url: result.secure_url,
    publicId: result.public_id,
  }
}

export { cloudinary }
