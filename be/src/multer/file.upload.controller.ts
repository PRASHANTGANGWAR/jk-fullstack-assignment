import { diskStorage } from 'multer';
import { extname } from 'path';
import { existsSync, mkdirSync } from 'fs';

// Define the directory where uploaded files will be stored
const uploadPath = './uploads/post';

// Check if the 'uploads/post' directory exists; if not, create it
if (!existsSync(uploadPath)) {
  mkdirSync(uploadPath, { recursive: true }); // Create directory recursively if needed
}

// Multer configuration options for handling file uploads
export const multerOptions = {
  storage: diskStorage({
    // Set destination folder for uploaded files
    destination: (req, file, callback) => {
      callback(null, uploadPath); // Store files in the predefined upload path
    },

    // Define filename format for uploaded files
    filename: (req, file, callback) => {
      // Generate a unique suffix using timestamp and a random number
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);

      // Construct the final filename using the field name, unique suffix, and original file extension
      const fileName = file.fieldname + '-' + uniqueSuffix + extname(file.originalname);

      callback(null, fileName); // Pass the filename to multer
    },
  }),
};
