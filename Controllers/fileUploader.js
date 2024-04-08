const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { google } = require('googleapis');

//There was a branch merge just for the safety we are doing this
// Multer configuration
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const uploads = multer({ storage: storage });

// Google Drive API configuration
const apikeys = require('../credentials.json');
const SCOPES = ['https://www.googleapis.com/auth/drive.file'];

// Function to authorize and get access to Google Drive API
async function authorize() {
  const authClient = new google.auth.JWT(
    apikeys.client_email,
    null,
    apikeys.private_key,
    SCOPES
  );
  await authClient.authorize();
  return authClient;
}

// Function to upload file to Google Drive
async function uploadFileToDrive(authClient, filePath, fileName) {
  const drive = google.drive({ version: 'v3', auth: authClient });

  // Upload the file to Google Drive
  const fileMetadata = { name: fileName };
  const media = {
    mimeType: 'image/jpeg',
    body: require('fs').createReadStream(filePath),
  };
  const response = await drive.files.create({
    resource: fileMetadata,
    media: media,
    fields: 'id',
  });

  // Set the file permissions to "anyone with the link can view"
  await drive.permissions.create({
    fileId: response.data.id,
    requestBody: {
      role: 'reader',
      type: 'anyone',
    },
  });

  // Extract the file ID from the response
  const fileId = response.data.id;

  // Construct the final URL
  const imageUrl = `https://drive.google.com/uc?export=view&id=${fileId}`;

  return imageUrl;
}

module.exports ={authorize,uploadFileToDrive}
