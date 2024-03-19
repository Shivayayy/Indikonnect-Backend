const { check, validationResult } = require('express-validator');

exports.validateShopCreation = [
    check('shopName').trim().not().isEmpty().withMessage('Shop Name cannot be empty').isLength({ min: 3, max: 20 }).withMessage('Shop owner name must be 3 to 20 characters long!'),
    check('address').trim().not().isEmpty().withMessage('Address cannot be empty'),
    // check('image').custom((value, { req }) => {
    //     if (!req.file || !req.file.buffer || req.file.buffer.length === 0) {
    //         throw new Error('Select valid image');
    //     }
    //     return true;
    // })
];

exports.shopValidation = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        return next();
    }
    const extractedErrors = [];
    errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }));

    return res.status(422).json({
        success: false,
        errors: extractedErrors
    });
};
