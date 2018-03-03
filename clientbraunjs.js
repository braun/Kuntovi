/**
 * Created by stani on 29.03.2017.
 */
var braunjs = require("./braunjs");
console.log("BRAUN JS LOADED");
window.braunjs = braunjs;
var pouchdb = require("pouchdb");
window.pouchdb = pouchdb;
window.moment = require("moment");