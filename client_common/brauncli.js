/**
 * Created by stani on 20.03.2017.
 */

function saveLs(key, object) {
    window.localStorage[key] = JSON.stringify(object, 2);
}

function loadLs(key, emptyConstructor) {
    if (window.localStorage[key] == null)
        if (emptyConstructor != null)
            saveLs(key, emptyConstructor());
        else
            return null;

    var rvs = window.localStorage[key];
    var rv = null;
    try {
        rv = JSON.parse(rvs);

    }
    catch (ex) {
        window.localStorage.removeItem(key);
        console.error(ex);
        rv = loadLs(key, emptyConstructor);
    }

    return rv;
}

/**
 * checks image size and resizes it to specified with and height when needed
 * @param blob - image
 * @param maxWidth - maximal widthw hen oversized by image resize of image will be performed
 * @param maxHeight - maximal height when oversized by image resize of image will be performed
 * @param callback callback resized image as parametter
 */
function resizeImage(blob,maxWidth,maxHeight,callback)
{
    var urlCreator = window.URL || window.webkitURL;
    var imageUrl = urlCreator.createObjectURL(blob);

    var image = new Image();
    image.src = imageUrl;

    image.onload = function () {
        var width = image.width;
        var height = image.height;
        var shouldResize = (width > maxWidth) || (height > maxHeight);

        if (!shouldResize) {
           callback(blob);
            return;
        }

        var newWidth;
        var newHeight;

        if (width > height) {
            newHeight = height * (maxWidth / width);
            newWidth = maxWidth;
        } else {
            newWidth = width * (maxHeight / height);
            newHeight = maxHeight;
        }

        var canvas = document.createElement('canvas');

        canvas.width = newWidth;
        canvas.height = newHeight;

        var context = canvas.getContext('2d');

        context.drawImage(this, 0, 0, newWidth, newHeight);

        canvas.toBlob(callback, "image/jpeg", 0.95);

    };

    image.onerror = function () {
        callback(null);
    };

}

/**
 * checks image size and resizes it using hermit-resize to specified with and height when needed
 * @param blob - image
 * @param maxWidth - maximal widthw hen oversized by image resize of image will be performed
 * @param maxHeight - maximal height when oversized by image resize of image will be performed
 * @param callback callback resized image as parametter
 */
function resizeImageHermit(blob,maxWidth,maxHeight,callback,lockAspect)
{
   
    var urlCreator = window.URL || window.webkitURL;
    var imageUrl = urlCreator.createObjectURL(blob);

    var image = new Image();
    image.src = imageUrl;

    image.onload = function () {
        var width = image.width;
        var height = image.height;
        var shouldResize = (width > maxWidth) || (height > maxHeight);

        if (!shouldResize) {
           callback(blob);
            return;
        }

        var newWidth;
        var newHeight;
        var startx = 0;
        var starty = 0;

        if (width > height) {
            if(lockAspect)
            {
                var reducedheight = width*(maxHeight/maxWidth);
                starty = (height-reducedheight)/2;
                height = reducedheight;
            }
            newHeight = height * (maxWidth / width);
            
            newWidth = maxWidth;
        } else {
            newWidth = width * (maxHeight / height);
            newHeight = maxHeight;
        }
        var canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        var context = canvas.getContext('2d');        
        context.drawImage(this, -startx, -starty, width, height+starty);
        
        var HERMITE = new HermitResize();
        HERMITE.resample(canvas, newWidth, newHeight,true,function()
        {
            canvas.toBlob(callback, "image/jpeg", 0.95);
        });
            
    };

    image.onerror = function () {
        callback(null);
    };

}

function toast(toast)
{


    var div = document.createElement('div');
    var span = document.createElement('div');
    span.innerHTML = toast;
    div.className="container-toast";
    span.className = "toast-text w3-opacity" 
    div.appendChild(span);
    document.body.appendChild(div);
    window.setTimeout(function()
    {
        document.body.removeChild(div);
    },2000);
}
