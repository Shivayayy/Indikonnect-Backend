const Shop = require('../Models/shop');
const multer = require('multer');
const sharp = require('sharp');

// Define storage and file filter for Multer
const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb(new Error('Invalid image file!'), false);
    }
};

// Initialize Multer with storage and file filter
const uploads = multer({ storage: storage, fileFilter: fileFilter });

const createShop = async (req, res) => {
    try {
        const { shopName, address ,latitude,longitude} = req.body;
        
        // Ensure that a file is uploaded
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'Image file is required' });
        }

        // Extract the image buffer from the request file
        const profileBuffer = req.file.buffer;
        const resizedImageBuffer = await sharp(profileBuffer)
            .resize({ width: 500, height: 500 })
            .jpeg({ quality: 80 })
            .toBuffer();
        
        // Create a new Shop object with the processed image
        const newShop = new Shop({
            shopName: shopName,
            owner: req.user._id,
            address: address,
            location: {
                type: 'Point',
                coordinates: [longitude,latitude]
            },
            image: resizedImageBuffer
        });
        
        // Save the new shop to the database
        const savedShop = await newShop.save();
        
        res.status(201).json({ success: true, message: 'Shop created successfully', shop: savedShop });
    } catch (error) {
        console.error('Error creating shop:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

//Export both createShop function and uploads middleware
module.exports = { createShop, uploads };
