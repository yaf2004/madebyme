import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { mkdirSync } from 'node:fs';
import crypto from 'node:crypto';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadDir = path.resolve(__dirname, '../uploads');
mkdirSync(uploadDir, { recursive: true });

const allowedExtensions = new Set(['.png', '.jpg', '.jpeg', '.webp']);
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${crypto.randomBytes(16).toString('hex')}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024, files: 1 },
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedExtensions.has(ext) && (!file.mimetype || file.mimetype.startsWith('image/'))) {
      return cb(null, true);
    }
    cb(new Error('Please upload a PNG, JPG, JPEG, or WEBP image.'));
  },
});

export const uploadRouter = express.Router();

uploadRouter.post('/', (req, res) => {
  upload.single('file')(req, res, (err) => {
    if (err) {
      const message = err.code === 'LIMIT_FILE_SIZE'
        ? 'Image is too large. Please choose an image under 10 MB.'
        : err.message || 'Unable to upload this image.';
      console.error('Payment screenshot upload rejected:', err.code || err.message);
      return res.status(400).json({ message });
    }
    if (!req.file) return res.status(400).json({ message: 'Please select a payment screenshot first.' });

    const file_url = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    console.log('Payment screenshot uploaded:', req.file.filename, req.file.size);
    return res.status(201).json({ file_url });
  });
});
