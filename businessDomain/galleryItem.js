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

  this.getSrcUrl = function()
    {
        if(this._attachments == null || this._attachments.image == null)
            return "default.png";

        return "content/images/"+this._id+"/image";
    }
}


module.exports = __constructor;
