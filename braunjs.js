/**
 * Created by stani on 16.03.2017.
 */
var moment = require("moment");

module.exports =
    {
        printDate: function(date)
        {
            var rv = moment(date).format("D.M.YYYY");
            return rv;
        },
        formatDbId: function(prefix)
        {
            var rv = "";
            var rnd = Math.random()*0x10000;
            var dates = moment().format("YYMMDDHHmmSS");
            if(prefix != null)
                rv = prefix + "_";
            rv += dates;
            rv+= "_"+rnd.toFixed(0);
            return rv;
        },
        isString: function(val)
        {
            return typeof val === "string";
        }
        ,
        isObject: function(val)
        {
            return typeof val === "object";
        }
    }
