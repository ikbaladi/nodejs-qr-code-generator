// DOM Elements
const textInput = document.getElementById('textInput');
const sizeInput = document.getElementById('sizeInput');
const errorLevel = document.getElementById('errorLevel');
const darkColor = document.getElementById('darkColor');
const lightColor = document.getElementById('lightColor');
const generateBtn = document.getElementById('generateBtn');
const resultSection = document.getElementById('resultSection');
const qrImage = document.getElementById('qrImage');
const downloadBtn = document.getElementById('downloadBtn');
const copyBtn = document.getElementById('copyBtn');
const resetBtn = document.getElementById('resetBtn');
const statusMessage = document.getElementById('statusMessage');
const loader = document.getElementById('loader');

let currentQRData = null;

// Event Listeners
generateBtn.addEventListener('click', generateQRCode);
downloadBtn.addEventListener('click', downloadQRCode);
copyBtn.addEventListener('click', copyQRCode);
resetBtn.addEventListener('click', resetForm);

// Enter key to generate
textInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        generateQRCode();
    }
});

// Generate QR Code
async function generateQRCode() {
    const text = textInput.value.trim();
    
    if (!text) {
        showStatus('Please enter some text or URL', 'error');
        textInput.focus();
        return;
    }

    showLoader(true);
    
    try {
        const response = await fetch('/api/generate-custom', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text: text,
                size: sizeInput.value,
                errorCorrectionLevel: errorLevel.value,
                darkColor: darkColor.value,
                lightColor: lightColor.value
            })
        });

        const data = await response.json();

        if (data.success) {
            currentQRData = data;
            qrImage.src = data.qrCode;
            resultSection.style.display = 'block';
            
            // Smooth scroll to result
            resultSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            
            showStatus('QR Code generated successfully!', 'success');
        } else {
            showStatus(data.message || 'Failed to generate QR code', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showStatus('Error connecting to server', 'error');
    } finally {
        showLoader(false);
    }
}

// Download QR Code
function downloadQRCode() {
    if (!currentQRData) return;

    const link = document.createElement('a');
    link.href = currentQRData.qrCode;
    link.download = `qrcode_${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showStatus('QR Code downloaded!', 'success');
}

// Copy QR Code to Clipboard
async function copyQRCode() {
    if (!currentQRData) return;

    try {
        // Convert data URL to blob
        const response = await fetch(currentQRData.qrCode);
        const blob = await response.blob();
        
        // Copy to clipboard
        await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob })
        ]);
        
        showStatus('QR Code copied to clipboard!', 'success');
    } catch (error) {
        console.error('Copy error:', error);
        showStatus('Failed to copy. Try downloading instead.', 'error');
    }
}

// Reset Form
function resetForm() {
    textInput.value = '';
    sizeInput.value = '300';
    errorLevel.value = 'M';
    darkColor.value = '#000000';
    lightColor.value = '#FFFFFF';
    resultSection.style.display = 'none';
    currentQRData = null;
    statusMessage.className = 'status-message';
    statusMessage.textContent = '';
    textInput.focus();
}

// Show Status Message
function showStatus(message, type) {
    statusMessage.textContent = message;
    statusMessage.className = `status-message ${type} show`;
    
    setTimeout(() => {
        statusMessage.classList.remove('show');
    }, 3000);
}

// Show/Hide Loader
function showLoader(show) {
    loader.style.display = show ? 'flex' : 'none';
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    textInput.focus();
    console.log('QR Code Generator ready! 🚀');
});
