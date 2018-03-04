/**
 * Created by stani on 16.03.2017.
 */
var braunjs = require("../braunjs");

function __constructor(proto)
{
if(proto != null)
    Object.assign(this,proto);
  this.printDate = function()
  {
      return braunjs.printDate(this.header.date);
  }

  this.getTitlePhotoUrl = function()
    {
        if(this.titlePhoto != null && this.titlePhoto.relativeUrl != null)
            return this.titlePhoto.relativeUrl;

        return "content/articles/"+this._id+"/title_photo";
    }
}


module.exports = __constructor;
