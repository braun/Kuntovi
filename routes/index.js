var express = require('express');
var router = express.Router();
var datasource = require("../data/datasource");
var articleConstructor = require('../businessDomain/article');


/* GET home page. */
router.get('/', function(req, res, next) {
  datasource.listCollection("headfotos",1,0,-1,articleConstructor,function(err,collection)
  { console.log(JSON.stringify(collection,2));
      datasource.listCollection("clanky",1,0,-1,articleConstructor,function(err,colclanky) {
          console.log(JSON.stringify(colclanky,2));
          res.render('index', {title: 'Express', headfotos: collection,articles: colclanky});
      });
  });

});

module.exports = router;
