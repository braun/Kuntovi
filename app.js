

var config = require('./config/nodeConfig.js');
var branding = config.branding;
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var article = require('./routes/article');

var app = express();
app.config = config;
var datasource = require(config.dataSource);
app.dataSource = datasource;
var efunc =console.error;
console.error = function(arg)
{
    efunc.bind(this)(arg.stack);
}
var articleConstructor = require('./businessDomain/article');


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
//app.use(bodyParser.json({limit: '5mb'}));
//app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());




app.use(express.static(path.join(__dirname, 'node_modules')));
app.use(express.static(path.join(__dirname, 'client_common')));
app.use(express.static(path.join(__dirname,branding )));

// admin app setup
// app.cache
var c = require('appcache-node');
// generate a cache file
var cacheFile = c.newCache(
    [
        "/w3.css",
        "/font-awesome/css/font-awesome.min.css",
        "/font-awesome/fonts/fontawesome-webfont.woff",
        "/tinymce/tinymce.js",
        "/tinymce/themes/modern/theme.js",
        "/tinymce/plugins/link/plugin.js",
        "/tinymce/plugins/image/plugin.js",
        "/tinymce/plugins/code/plugin.js",
        "/tinymce/skins/lightgray/skin.min.css",
        "/tinymce/skins/lightgray/content.min.css",
        "/tinymce/skins/lightgray/fonts/tinymce.woff",
        "/angular/angular.js",
        "/angular-ui-router/release/angular-ui-router.js",
        "/angular-ui-tinymce/src/tinymce.js",
        "/brauncli.css",
        "/brauncli.js",
        "/admin/admin.js",
        "/admin/modules/article.js",
        "/admin/router.js",
        "/admin/index.html",
        "/admin/modules/article.html","","NETWORK:",
"*"
    ]);


app.get("/admin/admin.appcache", function (r, s) {
    // send cache file
    s.writeHead(200, {'Content-Type': 'text/cache-manifest'});
    return s.end(cacheFile);
});
app.use("/admin", express.static(path.join(__dirname, 'admin')));


// view engine & routes setup
app.set('views', path.join(__dirname, branding));
app.set('view engine', 'ejs');
app.use('/', index);
app.use(article);



// map datasource
datasource.setupApp(app);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
