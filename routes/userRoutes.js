const router = require('express').Router();
const userController = require('../controllers/userController')

//Creating user registration route 
router.post('/create', userController.createUser);

//Login routes
router.post('/login',userController.loginUser)

//Forgot password
router.post('/forgot_password',userController.forgotPassword)

//Verify OTP and set new password
router.post('/verify_otp',userController.verifyOtpAndSetPassword)

//controller (Export) - Routes (import) - Use - (index.js)

//exporting the router
module.exports = router;