// app.js

const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const app = express();

const PORT = process.env.PORT || 3000;

// Ensure uploads folder exists
fs.mkdirSync(path.join(__dirname, 'uploads'), { recursive: true });

// Multer setup for file uploads (limit to 5MB)
const upload = multer({ dest: path.join(__dirname, 'uploads'), limits: { fileSize: 5 * 1024 * 1024 } });

// Disable client caching for development so edits appear immediately
app.use(express.static(path.join(__dirname, 'docs'), {
    etag: false,
    maxAge: 0,
    setHeaders: (res) => {
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
    }
}));

app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, 'docs', 'index.html'));
});

// Contact form endpoint (multipart/form-data)
app.post('/contact', upload.single('attachment'), (req, res) => {
    try {
        const { name, email, message } = req.body;
        const file = req.file; // may be undefined

        // Minimal handling: log submission and return acknowledgement
        console.log('Contact submission:', { name, email, message, file });

        res.json({ ok: true, message: 'Thanks — your message was received.', file: file ? file.filename : null });
    } catch (err) {
        console.error('Contact error', err);
        res.status(500).json({ ok: false, message: 'Server error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});