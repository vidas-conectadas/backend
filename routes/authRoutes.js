const express = require('express');
const { register, login, getUserData } = require('../controllers/authController'); // Importando os controladores
const { registerDonation, getDonationHistory, updateDonation, deleteDonation } = require('../controllers/donationController');

const router = express.Router();

router.post('/register', register);

router.post('/login', login);

router.get('/me', getUserData); 

router.post('/donations', registerDonation);

router.get('/donations/history', getDonationHistory);

router.put('/donations/:donationId', updateDonation);

router.delete('/donations/:donationId', deleteDonation);

module.exports = router;
