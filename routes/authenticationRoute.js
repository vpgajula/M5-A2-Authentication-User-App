const express = require('express');
const router = express.Router();
const authenticationController = require('../controllers/authenticationController');

//need the following route to display Home page
router.get('/home', authenticationController.home);

//need the following route to display Sign up form
router.get('/signup', authenticationController.signup);
router.get('/signupForm', authenticationController.signupForm);

//need the following route to create New User
router.post('/signup', authenticationController.signup);

//need the following route to send the login form to the browser
router.get('/loginForm', authenticationController.loginForm);

//need the following route to verify and login the user
router.post('/loginForm', authenticationController.login);

//need the following route to logout the user
router.post('/logout', authenticationController.logout);

module.exports = router;
