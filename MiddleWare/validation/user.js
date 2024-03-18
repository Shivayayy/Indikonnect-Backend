const { check, validationResult } = require('express-validator');

exports.validateUserSignUp = [
    check('UserName').trim().not().isEmpty().withMessage('Name can not be empty').isLength({ min: 3, max: 20 }).withMessage('Name must be 3 to 20 characters long!').custom(value => !/\s/.test(value)).withMessage('UserName cannot contain spaces!'),
    check('Email').normalizeEmail().isEmail().withMessage('Invalid Email'),
    check('Password').trim().not().isEmpty().withMessage('Password can not empty').isLength({ min: 8, max: 20 }).withMessage('Password must be 8 to 20 characters long!').matches(/^(?=.*[!@#$%^&*(),.?":{}|<>])/, 'g').withMessage('Password must contain at least one special character'),
    check('Role').trim().not().isEmpty().withMessage('Please select a role!')
];

exports.userValidation = (req, res, next) => {
    const result = validationResult(req).array();
    if (!result.length) return next();
    const error = result[0].msg;
    res.status(403).json({ success: false, message: error });
    console.log(result);
};

exports.validateUserSignIn =[
    check('UserName').trim().not().isEmpty().withMessage('Name can not be empty').isLength({ min: 3, max: 20 }).withMessage('Name must be 3 to 20 characters long!').custom(value => !/\s/.test(value)).withMessage('UserName cannot contain spaces!'),
    check('Password').trim().not().isEmpty().withMessage('Password is required'),
   
];