var colorString = require('color-string');
window.colorString = colorString;
window.moment = require('moment');


colorString.pxNormalize = function(cucolor)
{
    if(cucolor.startsWith("#") && cucolor.length == 9) /* android argb */
    {
        var rgba =  colorString.get.rgb(cucolor);
        var tmp = rgba[0];
        rgba[0] = rgba[1];
        rgba[1] = rgba[2];
        rgba[2] = rgba[3];
        rgba[3] = tmp;
        cucolor = colorString.to.rgb(rgba);
    }
    return cucolor;
}
colorString.toAndroidIntColor = function(color)
{
    var cucolor = colorString.get.rgb(color);
    var rv = cucolor[3]&0xff;
    rv = rv << 8;
    rv |= (cucolor[0]&0xff);
    rv = rv << 8;
    rv |=  (cucolor[1]&0xff);
    rv = rv << 8;
    rv |=  (cucolor[2]&0xff);

    return rv;
}
window.moment.toXmlString = function(m)
{
    var format = 'YYYY-MM-DDTHH:mm:ss';
    return m.format(format);
}

window.moment.toCzString = function(m)
{
    var format = 'YYYY-MM-DDTHH:mm:ss';
    return m.format(format);
}
