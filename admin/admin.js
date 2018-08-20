
/**
 * Created by stani on 17.03.2017.
 */

var dbc = function () {
    var db = new window.pouchdb('articles');
    var imgdb = new window.pouchdb('images');
    var remotedb;
    var remoteimg;
    var loginStatus = null;

    function remoteLogin() {
        var userName = localStorage.getItem("userName");
        var userPassword = localStorage.getItem("userPassword");
        
        loginStatus = rv.loginStatus = { overAll: true };

        if(userName == null || userPassword == null)
        {
            toast("Nejsou zadány přihlašovací údaje");
            return;
        }
        var loginStatus = rv.loginStatus;

        function updateLoginStatus(dbid,  response,err) {
            loginStatus[dbid] = {
               
                response: response,
                err:err
            }
            loginStatus.overAll &= response.ok;
            localStorage.setItem("loginStatus", JSON.stringify(loginStatus));
            console.log("LOGIN STATUS: " + JSON.stringify(loginStatus, null, 2));
        }
        var urlbase = location.protocol + '//' + location.hostname;
        if(location.port != null)
            urlbase += ":"+location.port;
        
        urlbase+=  "/content";
        remotedb = new window.pouchdb(urlbase+"/articles", {
            skip_setup: true
        });
        remotedb.logIn(userName, userPassword).then(function ( response) {
            console.log("I'm Batman.");
            updateLoginStatus("articledb", response);
            remoteimg = new window.pouchdb(urlbase+"/images", {
                skip_setup: true
            });
             remoteimg.logIn(userName, userPassword).then(function (response) {
                console.log("I'm Batman of images.");
                updateLoginStatus("imageedb", response);
                sync();
            }).catch((err)=>
            {
                updateLoginStatus("imageedb",{ ok:false}, err);
            });;
        }).catch((err)=>
        {
            updateLoginStatus("articledb",{ ok:false}, err);
        });;
    
       
    }

    function sync() {
        if (rv.loginStatus == null || rv.loginStatus.overAll == false) {
            console.error("SYNC: Cannot sync, not logged on");
            return;
        }
        db.replicate.to(remotedb,{ timeout: false,since:0 }).on('complete', function () {
            console.log("SYNC: OK");
        }).on('error', function (err) {
            console.error("SYNC: " + err.code + ", "+err.message);
        });
        imgdb.replicate.to(remoteimg,{ timeout: false,since:0 }).on('complete', function () {
            console.log("SYNC IMG: OK");
        }).on('error', function (err) {
            console.error("SYNC IMG: " + err.code+ ", "+err.message);
        });
    }

   

    function setTitlePhoto(article, photoBlob) {

        db.putAttachment(article._id, 'title_photo', article._rev, photoBlob, photoBlob.type)
            .then(function (result) {
                article._rev = result.rev;
                db.get(article._id).then(function (doc) {
                    article._attachments = doc._attachments;

                });
                toast("Titulní obrázek nastaven");
            }).catch(function (err) {
                toast("Nepodařilo se nastavit titulní obrázek");
                console.error(JSON.stringify(err));

            });
    }

    function addGalleryPhoto(article, photoBlob, thumbBlob, callback) {

        var doc = {
            _id: "image_" + article.idbase + "_" + braunjs.formatDbId()
        }
        imgdb.put(doc).then(
            function (res) {
                doc._rev = res.rev;
                setImage(doc, photoBlob, thumbBlob, callback);
            }
        ).catch(function (err) {
            toast("Nepodařilo se uložit informace o obrázku");
            console.error(JSON.stringify(err));
        });
    }

    function setImage(imageDoc, photoBlob, thumbBlob, callback) {

        imgdb.putAttachment(imageDoc._id, 'image', imageDoc._rev, photoBlob, photoBlob.type)
            .then(function (result) {
                imageDoc._rev = result.rev;
                toast("Obrázek uložen");
                if (thumbBlob) {
                    imgdb.putAttachment(imageDoc._id, 'thumb', imageDoc._rev, thumbBlob, thumbBlob.type)
                        .then(function (result) {
                            imageDoc._rev = result.rev;
                            toast("Náhled obrázku uložen");
                            callback(imageDoc);
                            //   sync();
                        }).catch(function (err) {
                            toast("Nepodařilo se uložit náhled obrázku");
                            console.error(JSON.stringify(err));

                        });
                } // else
                //   sync();
            }).catch(function (err) {
                toast("Nepodařilo se uložit obrázek");
                console.error(JSON.stringify(err));

            });

    }

    function getTitlePhoto(article, callback) {
        if (article._attachments == null || article._attachments.title_photo == null)
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
               var fn = function(imgdoc)
                {
                    getImage(imgdoc.doc, function (url) {
                        callback({
                            doc: imgdoc.doc,
                            url: url
                        });
                    })
                };
                fn(imgdoc);
            }
        }).catch(
            function (err) {
                toast("Nepodařilo se načíst galerii");
                console.error(JSON.stringify(err));
            });
    }

    function removeGalleryItem(galit, callback) {
        // var doc = rv.imgdb.get(galit._id).then((doc) => {
        //    return 
        rv.imgdb.remove(galit)
            //;
            //  })
            .then(function (res) {
                // sync();
                callback();
            }).catch(function (err) {
                console.error(JSON.stringify(err));
                toast("Nepodařilo se smazat obrázek");
            });
    }

    

    var rv = {
        db: db,
        imgdb: imgdb,
        sync: sync,
        loginStatus: {},
        remoteLogin: remoteLogin,
        setTitlePhoto: setTitlePhoto,
        getTitlePhoto: getTitlePhoto,
        setImage: setImage,
        getImage: getImage,
        addGalleryPhoto: addGalleryPhoto,
        getGalery: getGalery,
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

    $scope.userName = localStorage.getItem("userName");
    $scope.userPassword = localStorage.getItem("userPassword");
    $scope.doUserLogin = function () {
        localStorage.setItem("userName", $scope.userName);
        localStorage.setItem("userPassword", $scope.userPassword);
        $scope.db.remoteLogin();

    }
    $scope.isLoginAlert = function()
    {
        return $scope.db.loginStatus == null || !$scope.db.loginStatus.overAll;
    }
    $scope.db.remoteLogin();
    function loadLastWork() {
        db.db.allDocs({
            include_docs: true,
            limit: 10,
            descending: true
        }).then(function (res) {
            $scope.$apply(() => {
                $scope.lastWork = [];
                var articles = res.rows;
                for (var articleid in articles) {
                    var article = articles[articleid];
                    $scope.lastWork.push(article.doc);
                }
                console.log(JSON.stringify($scope.lastWork, null, 2));
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
        $rootScope.db.destroy(function () {
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
            if($scope.article.idbase == null)
               $scope.article.idbase = braunjs.formatDbId();
            $scope.article._id = "article_" + $scope.article.idbase;
        }
        $scope.article.user = 'braunie';

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
            categories: [],
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
    $scope.addGalleryPhoto = function (photo) {
        $scope.gallery.push(photo);
    }
    $scope.loadGallery = function () {
        $scope.gallery = [];
        $scope.db.getGalery($scope.article, function (imgdoc) {
            $scope.$apply(function () {
                $scope.gallery.push(imgdoc);
            });
        });
    }
    $scope.showArticleEditor = function (article) {
        $scope.article = article;
        $scope.setTitlePhoto(null);

        $scope.titlePhoto = null;
        $scope.db.getTitlePhoto(article, function (imageUrl) {
            $scope.$apply(function () {
                $scope.setTitlePhoto(imageUrl);
            });
        });
        $scope.loadGallery();
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

function myFunc(id) {
    var x = document.getElementById(id);

    if (x.className.indexOf("w3-show") == -1) {
        x.className += " w3-show";
        x.previousElementSibling.className += " w3-red";
    } else {
        x.className = x.className.replace(" w3-show", "");
        x.previousElementSibling.className =
            x.previousElementSibling.className.replace(" w3-red", "");
    }
}