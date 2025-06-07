import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Define Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'resources', // Optional: customize folder name in Cloudinary
    allowed_formats: ['jpg', 'png', 'jpeg', 'pdf', 'docx'], // Add more as needed
    public_id: (req, file) => `${Date.now()}-${file.originalname}`, // Optional: custom public ID
  }
});

// Configure multer with the Cloudinary storage
const upload = multer({ storage });

// Export the configured upload middleware
export default upload;
