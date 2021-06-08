const express = require('express');
const path = require('path');

const router = express.Router();

router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'index.html'));
});
router.get('/test', (req, res) => {
  res.send("Hello World! This was sent from one commit.")
})

module.exports = router;