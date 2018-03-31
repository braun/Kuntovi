var express = require('express');
var router = express.Router();
var datasource = require("../db/datasource");
var articleConstructor = require('../businessDomain/article');
var galeryItemConstructor = require('../businessDomain/galleryItem');

/* GET home page. */
router.get('/', function(req, res, next) {
 var banners = [];

  datasource.getGallery("titlegallery", galeryItemConstructor)
  .then((banns)=> {
        banners = banns;
        console.log(JSON.stringify(banners,2));
        return datasource.getArticles(null,10,articleConstructor);
    }).then((articles) => {
       
          res.render('index', {articles: articles,banners:banners});
      }).catch((err)=>
      {
          console.error(err);
          res.render('error',{error: err})
      });
  });

  router.get('/category/:category', function(req, res, next) {
    var banners = [];
    
      datasource.getGallery("titlegallery", galeryItemConstructor)
    .then((banns)=> {
        banners = banns;
        console.log(JSON.stringify(banners,2));
        return datasource.getArticles(null,10,articleConstructor,[req.params.category]);
    }).then((articles) => {
       
          res.render('index', {articles: articles,banners:banners});
      }).catch((err)=>
      {
          console.error(err);
          res.render('error',{error: err})
      });
  });
        
module.exports = router;
