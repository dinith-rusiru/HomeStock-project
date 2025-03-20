const express = require('express');
const router = express.Router();
const authtoken = require('../middleware/authToken'); 
const userSignUpController = require('../Controllers/userSignUp');
const useSignInController = require('../controller/userSignIn');
const userDetails = require('../controller/userDetails');

router.post('/signup', userSignUpController);
router.post('/signin', useSignInController);
router.get('/user-details', authtoken, userDetails);



module.exports = router;

