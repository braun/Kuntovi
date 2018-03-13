/**
 * Created by stani on 29.03.2017.
 */
var braunjs = require("../braunjs");

window.braunjs = braunjs;
var pouchdb = require("pouchdb");
window.pouchdb = pouchdb;
window.moment = require("moment");
window.HermitResize = require("hermite-resize");
window.pouchdbAuthentication = require("pouchdb-authentication");
pouchdb.plugin(require('pouchdb-authentication'));