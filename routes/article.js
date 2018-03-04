var express = require('express');
var router = express.Router();
var datasource = require("../db/datasource");
var articleConstructor = require('../businessDomain/article');
/* GET article detail. */
router.get('/article/:articleId', function(req, res, next) {
  var articleId = req.params.articleId;
    console.log("get article id: " +articleId);
    datasource.getCollectionItem("clanky",articleId,4,articleConstructor,function(err,article) {
        console.log(JSON.stringify(article,2));
        res.render('clanek', {title: 'OBLog',article:article[articleId]});
    });
});

module.exports = router;
