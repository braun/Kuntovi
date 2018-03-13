var app = require("../app");

var mkdirp = require('mkdirp');
mkdirp.sync("./db");

var PouchDB = require('pouchdb').defaults({
    prefix: './db/'
});
PouchDB.plugin(require('pouchdb-find'));

PouchDB.plugin(require("pouchdb-validation"));

var dbarticles = PouchDB('articles');
var dbimages = PouchDB('images');


var datasource = {
        cookies: {},
        users: {},
        PouchDB: PouchDB,
        dbarticles: dbarticles,
        dbimages: dbimages,
        setupApp: function (app) {


            app.use('/content', function (req, res, next) {
                datasource.checkAuthSession(req, res);

                // check user is valid for the request
                if (!req.originalUrl.endsWith("_session")) {
                    if (req.method !== "GET" && req.method !== "HEAD") {
                        function writeUnauthorized(res) {

                            res.statusCode = 401;
                            res.send();
                        }
                        var authSession = req.cookies.AuthSession;
                        if (authSession == null || datasource.cookies[authSession] == null) {
                            console.error("Sending unauthorized status: " + authSession);
                            writeUnauthorized(res);
                            return;
                        }
                    }
                }
                next();

            });
            app.use('/content', require('express-pouchdb')(PouchDB));


        },
        getArticles: function (startkey, limit, itemConstructor, categories) {
            startkey = "article_" + (startkey == null ? "" : startkey);
            // return dbarticles.allDocs(
            //     {
            //         endkey: startkey,
            //         limit: limit,
            //         descending: true,
            //         include_docs:true
            //     }
            var selector = {
                selector: {
                    $and: [{
                        _id: {
                            $gte: startkey
                        },
                        published: {
                            $eq: true
                        }
                    }]
                },
                limit: limit,
                sort: [{
                    "_id": "desc"
                }]
            };

            if (categories != null)
                selector.selector["$and"][0].categories = {
                    $all: categories
                };

            return dbarticles.find(
                selector
            ).then((res) => {
                return new Promise((resolve) => {
                    var rvar = [];
                    res.docs.forEach((it) => {
                        rvar.push(new itemConstructor(it));
                    });
                    resolve(rvar);
                });
            });
        },
        getArticle: function (id, itemConstructor) {

            return dbarticles.get(id).then((res) => {
                return new Promise((resolve) => {
                    if (res == null)
                        resolve(null);
                    else
                        resolve(new itemConstructor(res));
                });
            });
        },
        getGallery: function (startkey, itemConstructor) {
            startkey = "image_" + (startkey == null ? "" : startkey);
            return dbimages.allDocs({
                    endkey: startkey,
                    startkey: startkey + "\ufff0",
                    descending: true,
                    include_docs: true
                }

            ).then((res) => {
                return new Promise((resolve) => {
                    var rvar = [];
                    res.rows.forEach((it) => {
                        rvar.push(new itemConstructor(it.doc));
                    });
                    resolve(rvar);
                });
            });
        },
        checkAuthSession: function (req, res) {
            var oldSend = res.send;


            //intercept response from pouchdb
            res.send = function (data) {
                var currentAuthSession = req.cookies.AuthSession;
                var authsession = null;
                var authSessionLabel = "AuthSession=";
                var setcookie = res._headers["set-cookie"];
                if(!Array.isArray(setcookie))
                  setcookie = [setcookie];
                  setcookie.forEach((setcookie)=>
                {
                    if (setcookie != null) {
                        var idx = setcookie.indexOf(authSessionLabel);
                        if (idx != -1) {
                            authsession = setcookie.substring(idx + authSessionLabel.length);
                            idx = authsession.indexOf(";");
                            if (idx != -1)
                                authsession = authsession.substring(0, idx);
                        }
                    }
                });
               
                if (req.originalUrl.endsWith("_session") && req.body != null && req.body.name != null) {
                    var username = req.body.name;
                    if (res.statusCode != "500") {
                        if (username != null) {
                            if (res.statusCode == "200") {
                                // logged on!

                                var user = datasource.users[username];
                                if (user == null)
                                    datasource.users[username] = user = {
                                        authsessionCookies: [] //,
                                        //    userCtx: data
                                    };
                                if(user.authsessionCookies.indexOf(authsession) == -1)
                                    user.authsessionCookies.push(authsession);

                                console.log("LOGGED USER: " + JSON.stringify(datasource.users[username]));
                                datasource.cookies[authsession] = username;

                            } else {
                                if (datasource.users[username] != null) {
                                    var urecord = datasource.users[username];
                                    delete datasource.cookies[urecord.authsessionCookie];
                                    delete datasource.users[username];
                                }
                                console.error("User: " + username + " is not logged on");
                            }
                        }
                    }
                } else
                if (currentAuthSession != authsession) {

                    var username = datasource.cookies[currentAuthSession];

                    if (username != null) {
                        console.log("USER: " + username + " replace cookie: " + currentAuthSession + " -> " + authsession);
                        delete datasource.cookies[currentAuthSession];
                        datasource.cookies[authsession] = username;
                    }

                }
                oldSend.apply(res, arguments);
            }


        }
    }

        module.exports = datasource;