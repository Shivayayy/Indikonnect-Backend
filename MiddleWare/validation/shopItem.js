const { check, validationResult } = require('express-validator');

exports.validateSearchProduct = [
    check('itemName').trim().not().isEmpty().withMessage('Item name cannot be empty').isString().withMessage('Item name must be a string')
];

exports.validateAutoUpdate = [
    check('quantity').trim().not().isEmpty().withMessage('Quantity cannot be empty').isNumeric().withMessage('Quantity must be a number'),
    check('price').trim().not().isEmpty().withMessage('Price cannot be empty').isNumeric().withMessage('Price must be a number'),
    check('itemId').trim().not().isEmpty().withMessage('Item ID cannot be empty').isMongoId().withMessage('Item ID must be a valid MongoDB ID')
];

exports.validateManualUpdate = [
    check('itemName').trim().not().isEmpty().withMessage('Item name cannot be empty').isString().withMessage('Item name must be a string'),
    check('description').trim().not().isEmpty().withMessage('Description cannot be empty').isString().withMessage('Description must be a string'),
    check('price').trim().not().isEmpty().withMessage('Price cannot be empty').isNumeric().withMessage('Price must be a number'),
    check('netWeight').trim().not().isEmpty().withMessage('Net weight cannot be empty').isNumeric().withMessage('Net weight must be a number'),
    check('unit').trim().not().isEmpty().withMessage('Unit cannot be empty').isString().withMessage('Unit must be a string'),
    check('category').trim().not().isEmpty().withMessage('Category cannot be empty').isString().withMessage('Category must be a string'),
    check('quantity').trim().not().isEmpty().withMessage('Quantity cannot be empty').isNumeric().withMessage('Quantity must be a number')
];

exports.validateUpdateVariant = [
    check('itemId').trim().not().isEmpty().withMessage('Item ID cannot be empty').isMongoId().withMessage('Item ID must be a valid MongoDB ID'),
    check('price').trim().not().isEmpty().withMessage('Price cannot be empty').isNumeric().withMessage('Price must be a number'),
    check('quantity').trim().not().isEmpty().withMessage('Quantity cannot be empty').isNumeric().withMessage('Quantity must be a number'),
    check('unit').trim().not().isEmpty().withMessage('Unit cannot be empty').isString().withMessage('Unit must be a string'),
    check('netWeight').trim().not().isEmpty().withMessage('Net weight cannot be empty').isNumeric().withMessage('Net weight must be a number'),
];



exports.itemValidation = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        return next(); 
    }
    // Extract the error messages from the validation errors
    console.log(errors);
    const errorMessages = errors.array().map(error => error.msg);

    // Return a response with 400 status code and the error messages
    res.status(400).json({ success: false, errors: errorMessages });
};


