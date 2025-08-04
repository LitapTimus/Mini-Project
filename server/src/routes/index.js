const express = require('express');
const router = express.Router();

// Sample test route
router.get('/test', (req, res) => {
    res.json({ message: 'API route working!' });
});

module.exports = router;
