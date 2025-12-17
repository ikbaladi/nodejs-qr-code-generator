const express = require('express');
const QRCode = require('qrcode');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Routes

// 1. Homepage
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 2. Generate QR Code as Data URL (untuk preview di browser)
app.post('/api/generate', async (req, res) => {
  try {
    const { text, size = 300, errorCorrectionLevel = 'M' } = req.body;

    if (!text) {
      return res.status(400).json({ 
        success: false, 
        message: 'Text is required' 
      });
    }

    // Generate QR code as Data URL
    const qrCodeDataURL = await QRCode.toDataURL(text, {
      width: parseInt(size),
      errorCorrectionLevel: errorCorrectionLevel,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });

    res.json({
      success: true,
      qrCode: qrCodeDataURL,
      text: text,
      size: size
    });

  } catch (error) {
    console.error('Error generating QR code:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate QR code',
      error: error.message
    });
  }
});

// 3. Generate QR Code with custom colors
app.post('/api/generate-custom', async (req, res) => {
  try {
    const { 
      text, 
      size = 300, 
      darkColor = '#000000', 
      lightColor = '#FFFFFF',
      errorCorrectionLevel = 'M'
    } = req.body;

    if (!text) {
      return res.status(400).json({ 
        success: false, 
        message: 'Text is required' 
      });
    }

    const qrCodeDataURL = await QRCode.toDataURL(text, {
      width: parseInt(size),
      errorCorrectionLevel: errorCorrectionLevel,
      margin: 1,
      color: {
        dark: darkColor,
        light: lightColor
      }
    });

    res.json({
      success: true,
      qrCode: qrCodeDataURL,
      text: text,
      size: size,
      colors: { dark: darkColor, light: lightColor }
    });

  } catch (error) {
    console.error('Error generating custom QR code:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate QR code',
      error: error.message
    });
  }
});

// 4. Download QR Code as PNG
app.get('/api/download', async (req, res) => {
  try {
    const { text, size = 300 } = req.query;

    if (!text) {
      return res.status(400).send('Text parameter is required');
    }

    // Generate QR code as buffer
    const qrCodeBuffer = await QRCode.toBuffer(text, {
      width: parseInt(size),
      margin: 1
    });

    // Set headers for download
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Content-Disposition', 'attachment; filename=qrcode.png');
    res.send(qrCodeBuffer);

  } catch (error) {
    console.error('Error downloading QR code:', error);
    res.status(500).send('Failed to generate QR code');
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'QR Code Generator API'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Endpoint not found' 
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 QR Code Generator Server running on http://localhost:${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV}`);
});