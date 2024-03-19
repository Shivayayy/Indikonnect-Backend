const express = require('express');
const router = express.Router();
const { isAuth } = require('../MiddleWare/auth');

const { searchProduct, autoUpdate, manualUpdate, updateVariant } = require('../Controllers/shopItem');
const {
    validateSearchProduct,
    validateAutoUpdate,
    validateManualUpdate,
    validateUpdateVariant,
    itemValidation
} = require('../MiddleWare/validation/shopItem');

router.post('/searchProduct', 
isAuth, 
// validateSearchProduct, 
// itemValidation, 
searchProduct);

router.post('/autoUpdate', 
isAuth, 
// validateAutoUpdate, 
// itemValidation, 
autoUpdate);

router.post('/manualUpdate', 
isAuth, 
// validateManualUpdate, 
// itemValidation, 
manualUpdate);

router.post('/updateVariant', 
isAuth, 
// validateUpdateVariant, 
// itemValidation, 
updateVariant);

module.exports = router;
