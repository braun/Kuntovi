var express = require('express');
var router = express.Router();
var datasource = require("../db/datasource");
var articleConstructor = require('../businessDomain/article');


/* GET home page. */
router.get('/', function(req, res, next) {
 
      datasource.getArticles(null,10,articleConstructor).then
      ((articles) => {
      //    console.log(JSON.stringify(articles,2));
          res.render('index', {articles: articles});
      }).catch((err)=>
      {
          console.error(err);
          res.render('error',{error: err})
      });
  });

  router.get('/category/:category', function(req, res, next) {
    
         datasource.getArticles(null,10,articleConstructor,[req.params.category]).then
         ((articles) => {
             console.log(JSON.stringify(articles,2));
             res.render('index', {articles: articles});
         }).catch((err)=>
         {
             console.error(err);
             res.render('error',{error: err})
         });
     });
module.exports = router;
