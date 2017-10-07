// Library Requirements
var express = require('express');
var router = express.Router();
var $ = require('jquery');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/filter', function(req, res, next) {
  res.render('filter');
});

router.get('/select_frame', function(req, res, next) {
  res.render('select_frame');
});

router.get('/share', function(req, res, next) {
  res.render('share');
});

module.exports = router;
