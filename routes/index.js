var express = require('express');
var path = require('path');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});
router.get('/api/text', function(req, res) {
  res.sendFile(path.join(__dirname, '..' , 'public', 'index.json'));
});

module.exports = router;
