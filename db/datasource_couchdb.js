var app = require("../app");
var NodeCouchDb = require("node-couchdb");
var httpProxy = require('http-proxy');
var proxy = httpProxy.createProxyServer();


var config;
var couch;
var datasource = {
        cookies: {},
        users: {},
       
        setupApp: function (app) {
            var c = new NodeCouchDb(app.config.couchOpts);
            datasource.couch = c;
            config = app.config;
            couch = c;
            var imagesUrl = couch._baseUrl+"/"+app.config.imagesDb;
            var articlesUrl = couch._baseUrl+"/"+app.config.articlesDb;
            app.all("/content/images/*", function(req, res) {
                console.log('redirecting to:'+imagesUrl);
                req.url = req.url.replace("/content/images","");
                req.originalUrl = req.originalUrl.replace("/content/images","");
                req.path = req.path.replace("/content/images","");
                proxy.web(req, res, {target: imagesUrl});
            });
            app.all("/content/articles/*", function(req, res) {
                console.log('redirecting to:'+articlesUrl);
                req.url = req.url.replace("/content/articles","");                
                proxy.web(req, res, {target: articlesUrl});
            });
	app.all("/content/*",function(req,res) {
		req.url = req.originalUrl.replace("/content","");
		proxy.web(req,res,{target: couch._baseUrl});
	});
            //
            // Listen for the `error` event on `proxy`.
            proxy.on('error', function (err, req, res) {
                res.writeHead(500, {
                'Content-Type': 'text/plain'
                });
                console.error(err.stack !=null ? err.stack : err);
                res.end('Something went wrong.');
            });
 
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

            return couch.mango(config.articlesDb,
                selector,{}
            ).then((res) => {
                return new Promise((resolve) => {
                    var rvar = [];
                    res.data.docs.forEach((it) => {
                        rvar.push(new itemConstructor(it));
                    });
                    resolve(rvar);
                });
            });
        },
        getArticle: function (id, itemConstructor) {

            
          return  couch.get(config.articlesDb,id).then((res) => {
                return new Promise((resolve) => {
                    if (res == null)
                        resolve(null);
                    else
                        resolve(new itemConstructor(res.data));
                });
            });
        },
        getGallery: function (startkey, itemConstructor) {
            startkey = "image_" + (startkey == null ? "" : startkey);
            return couch.get(config.imagesDb,"_all_docs",{
                    endkey: startkey,
                    startkey: startkey + "\ufff0",
                    descending: true,
                    include_docs: true
                }

            ).then((res) => {
                return new Promise((resolve) => {
                    var rvar = [];
                    res.data.rows.forEach((it) => {
                        rvar.push(new itemConstructor(it.doc));
                    });
                    resolve(rvar);
                });
            });
        },
   
    }

        module.exports = datasource;
