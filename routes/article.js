var express = require('express');
var router = express.Router();

var articleConstructor = require('../businessDomain/article');
var galeryItemConstructor = require('../businessDomain/galleryItem');
/* GET article detail. */
router.get('/article/:articleId', function (req, res, next) {
    var app=require("../app");
    var articleId = req.params.articleId;
    console.log("get article id: " + articleId);
    var article = null;
    var datasource = app.dataSource;
    datasource.getArticle(articleId, articleConstructor).then((art) => {
        console.log(JSON.stringify(article, 2));
        if (art == null) {
            res.status = 404;
            res.statusMessage = "OOOOOPPPSSSS";
            return;
        }
        article = art;       
        return datasource.getGallery(article.idbase, galeryItemConstructor);
    }).then((gallery) => {
        res.render('clanek', {
            article: article,
            gallery: gallery
         
        });
    }).catch((err) => {
        console.error(err);
        res.status = 500;
        res.statusMessage = err;
        return;
    });
});

module.exports = router;