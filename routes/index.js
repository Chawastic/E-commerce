var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  //#swagger.tags = ['Get and render home-page']
      // #swagger.description = "Just renders home-page"
  res.render('index', { user: req.user });
});

module.exports = router;
