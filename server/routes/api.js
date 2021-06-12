const express = require('express');
const path = require('path');

const router = express.Router();

router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'index.html'));
  console.log(req)
});
router.get('/test', (req, res) => {
  res.send("Hello World! The server URL works!");
  console.log(req)
})

module.exports = router;