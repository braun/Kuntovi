/**
 * Created by stani on 17.03.2017.
 */

var dbc = function () {
    var db = new window.pouchdb('articles');
    var imgdb = new window.pouchdb('images');

    var remotedb =  new window.pouchdb("http://localhost:3000/content/articles");
    var remoteimg =  new window.pouchdb("http://localhost:3000/content/images");
    function sync() {
        db.replicate.to(remotedb);
        imgdb.replicate.to(remoteimg);
    }

    function setTitlePhoto(article, photoBlob) {

        db.putAttachment(article._id, 'title_photo', article._rev, photoBlob, photoBlob.type)
            .then(function (result) {
                article._rev = result.rev;
                db.get(article._id).then(function(doc)
                {
                    article._attachments = doc._attachments;

                });
                toast("Titulní obrázek nastaven");
            }).catch(function (err) {
                toast("Nepodařilo se nastavit titulní obrázek");
                console.error(JSON.stringify(err));

            });
    }

    function addGalleryPhoto(article, photoBlob) {

        var doc = {
            _id: "image_" + article.idbase + "_" + braunjs.formatDbId()
        }
        imgdb.put(doc).then(
            function (res) {
                doc._rev = res.rev;
                setImage(doc, photoBlob);
            }
        ).catch(function (err) {
            toast("Nepodařilo se uložit informace o obrázku");
            console.error(JSON.stringify(err));
        });
    }

    function setImage(imageDoc, photoBlob) {

        imgdb.putAttachment(imageDoc._id, 'image', imageDoc._rev, photoBlob, photoBlob.type)
            .then(function (result) {
                imageDoc._rev = result.rev;
                toast("Obrázek uložen");
                sync();
            }).catch(function (err) {
                toast("Nepodařilo se uložit obrázek");
                console.error(JSON.stringify(err));

            });
    }

    function getTitlePhoto(article, callback) {
        if(article._attachments == null || article._attachments.title_photo == null)
            return;
        db.getAttachment(article._id, 'title_photo').then(
            function (blob) {
                var urlCreator = window.URL || window.webkitURL;
                var imageUrl = urlCreator.createObjectURL(blob);
                callback(imageUrl);
                // handle result
            }).catch(function (err) {
            toast("Nepodařilo se načíst titulní obrázek");
            console.error(JSON.stringify(err));
        });
    }

    function getImage(article, callback) {
        imgdb.getAttachment(article._id, 'image').then(
            function (blob) {
                var urlCreator = window.URL || window.webkitURL;
                var imageUrl = urlCreator.createObjectURL(blob);
                callback(imageUrl);
                // handle result
            }).catch(function (err) {
            toast("Nepodařilo se načíst  obrázek");
            console.error(JSON.stringify(err));
        });
    }

    function getGalery(article, callback) {
        var idprefix = "image_" + article.idbase;
        imgdb.allDocs({
             startkey: idprefix,
             endkey: idprefix + "\ufff0",
            include_docs: true

        }).then(function (res) {
          
            var articles = res.rows;
            for (var articleid in articles) {
                var imgdoc = articles[articleid];
                getImage(imgdoc.doc, function (url) {
                    callback({
                        doc: imgdoc.doc,
                        url: url
                    });
                })
            }
        }).catch(
            function (err) {
                toast("Nepodařilo se načíst galerii");
                console.error(JSON.stringify(err));
            });
    }

    function removeGalleryItem(galit)
    {
        rv.imgdb.remove(galit).then(function(res)
        {
            sync();
        }).catch(function(err)
        {
            console.error(JSON.stringify(err));
            toast("Nepodařilo se smazat obrázek");
        });
    }

    sync();

    var rv = {
        db: db,
        imgdb: imgdb,
        sync: sync,
        setTitlePhoto: setTitlePhoto,
        getTitlePhoto: getTitlePhoto,
        setImage: setImage,
        getImage: getImage,
        addGalleryPhoto: addGalleryPhoto,
        getGalery:getGalery,
        removeGalleryItem: removeGalleryItem,
        destroy: function (callback) {
            rv.db.destroy().then(function () {
                toast("Seznam článků vyprázdněn");
              rv.db = new window.pouchdb('articles');                
            
               rv.imgdb.destroy().then(function () {
                    rv.imgdb = new window.pouchdb('images');
                    toast("Seznam obrázků vyprázdněn");

                    callback();
                }).catch(function (err) {
                    toast("Nepodařilo se vyprázdnit seznam obrázků");
                    console.error(err);
                })
            
            }).catch(function (err) {
                toast("Nepodařilo se vyprázdnit seznam článků");
                console.error(err);

            });            
        }
    }
    return rv;
}

var app = angular.module("app", ["ui.router", 'ui.tinymce', 'angular-loading-bar']);
app.controller('topController', ['$rootScope', '$scope', '$state', "$http", function ($rootScope, $scope, $state, $http) {
            var db = dbc();
            $rootScope.db = db;

            function loadLastWork() {
                db.db.allDocs({
                    include_docs: true,
                    limit: 5,
                    descending:true
                }).then(function (res) {
                    $scope.$apply(()=>
                    {
                        $scope.lastWork = [];
                        var articles = res.rows;
                        for (var articleid in articles) {
                            var article = articles[articleid];
                            $scope.lastWork.push(article.doc);
                        }
                        console.log(JSON.stringify($scope.lastWork,null,2));
                    });
                }).catch(
                    function (res) {
                        toast("Nepodařilo se načíst poslední články");
                        console.error(JSON.stringify(res));
                    });

            }
            $scope.clearDb = function () {
                if (!window.confirm("Opravdu vyprázdnit seznam článků ?"))
                    return;
                    $scope.lastWork = [];
                $rootScope.db.destroy(function()
            {
                loadLastWork();
            });
            }
            $scope.loadLastWork = loadLastWork;
            $scope.printDate = function (date) {
                var d = braunjs.printDate(date);
                return d;
            }
            $scope.saveArticle = function () {
                // toast("Ukladam");
                //saveLs($scope.article);
                if ($scope.article._id == null) {
                    $scope.article.idbase = braunjs.formatDbId();
                    $scope.article._id = "article_" + $scope.article.idbase;
                }
                    $scope.db.db.put(

                        $scope.article).then(
                        function (res) {
                            $scope.article._rev = res.rev;
                            toast("Článek uložen");
                            $scope.db.sync();
                            $scope.gallery.forEach(galit => {
                                if (galit.doc != null && !galit.dirty)
                                    return;

                                //    if(galit.doc == null)
                                //         galit.doc = {
                                //             _id: "image_"+$scope.article.idbase+"_" +braunjs.formatDbId()
                                //         }
                                //     $scope.db.imgdb.put(doc).then(
                                //        function(res) {
                                //             toast("Obrázek uložen");
                                //         }
                                //     )
                            });
                            $scope.loadLastWork();
                        },
                        function (res) {
                            toast("Chyba při ukládání článku");
                            console.error(JSON.stringify(res));
                        });

                    }
                
                $scope.newArticle = function () {
                    $scope.article = {
                    
                     header: {

                         date: new Date()
                     }
                 };
                 $scope.saveArticle();
                    $scope.showArticleEditor($scope.article);
                   
                    w3_close();
                }
                $scope.setTitlePhoto = function (imageUrl) {
                    $scope.titlePhoto = imageUrl;
                }
                $scope.addGalleryPhoto = function (imageUrl) {
                    $scope.gallery.push({
                        url: imageUrl
                    });
                }
                $scope.showArticleEditor = function (article) {
                    $scope.article = article;
                    $scope.setTitlePhoto(null);
                    $scope.gallery = [];
                    $scope.titlePhoto = null;
                    $scope.db.getTitlePhoto(article, function (imageUrl) {
                        $scope.$apply(function () {
                            $scope.setTitlePhoto(imageUrl);
                        });
                    });
                    $scope.db.getGalery(article, function (imgdoc) {
                        $scope.$apply(function () {
                            $scope.gallery.push(imgdoc);
                        });
                    });
                    w3_close();
                }

                loadLastWork();
             
            }]);

        app.directive('customOnChange', function () {
            return {
                restrict: 'A',
                link: function (scope, element, attrs) {
                    var onChangeFunc = scope.$eval(attrs.customOnChange);
                    element.bind('change', onChangeFunc);
                }
            };
        });