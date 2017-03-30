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
