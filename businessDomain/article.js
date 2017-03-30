/**
 * Created by stani on 16.03.2017.
 */
var braunjs = require("../braunjs");

function __constructor()
{
  this.printDate = function()
  {
      return braunjs.printDate(this.header.date);
  }

  this.getTitlePhotoUrl = function()
    {
        if(this.titlePhoto != null && this.titlePhoto.relativeUrl != null)
            return this.titlePhoto.relativeUrl;

        return "images/obmap.jpg";
    }
}


module.exports = __constructor;
