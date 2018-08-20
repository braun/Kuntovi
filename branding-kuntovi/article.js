function changeBanner(element)
{
    var src = element.src.replace("thumb","image");
    var bannerElement= document.getElementById("bannerImage");
    if(bannerElement == null)
        return;
    
        bannerElement.src = src;
}


function showGallery(element,seek)
{
    var sideGalleryEl = document.getElementById("sidegallery");
    var gcanvas = document.getElementById("gcanvas");       
    if(gcanvas.sideimgs == null)
        gcanvas.sideimgs = sideGalleryEl.querySelectorAll(".galimg");

        if(seek == true)
        {
            for(var i = 0;i < gcanvas.sideimgs.length;i++)
                if(element === gcanvas.sideimgs[i])
                {
                    gcanvas.currentIndex = i;
                    break;
                }
        }

    var galleryEl = document.getElementById("gallery");
    galleryEl.style.display="block";
    var gcanvas = document.getElementById("gcanvas");
    var src = element.src.replace("thumb","image");
    gcanvas.currentSourceImage = element;
     gcanvas.src = src;
     gcanvas.onload = function()
     {
         if(gcanvas.width < gcanvas.height)
            gcanvas.classList.add("portrait");
         else
         gcanvas.classList.remove("portrait");

     }
}
function closeGallery()
{
    var galleryEl = document.getElementById("gallery");
    galleryEl.style.display="none";
}

function nextGalleryImage()
{
    var gcanvas = document.getElementById("gcanvas");
    var galleryEl = document.getElementById("gallery");
    var sideGalleryEl = document.getElementById("sidegallery");
    
    if(gcanvas.sideimgs == null)
        gcanvas.sideimgs = sideGalleryEl.querySelectorAll(".galimg");

    if(gcanvas.currentIndex == null)
        gcanvas.currentIndex = -1;

    var nexti = gcanvas.currentIndex+1;
    if(nexti >= gcanvas.sideimgs.length)
        nexti = 0;

    gcanvas.currentIndex = nexti;
     showGallery(gcanvas.sideimgs[gcanvas.currentIndex]);
}


function prevGalleryImage()
{
    var gcanvas = document.getElementById("gcanvas");
    var galleryEl = document.getElementById("gallery");
    var sideGalleryEl = document.getElementById("sidegallery");
    
    if(gcanvas.sideimgs == null)
        gcanvas.sideimgs = sideGalleryEl.querySelectorAll(".galimg");

    if(gcanvas.currentIndex == null)
        gcanvas.currentIndex = -1;

    var nexti = gcanvas.currentIndex-1;
    if(nexti < 0)
        nexti = gcanvas.sideimgs.length-1;

    gcanvas.currentIndex = nexti;
     showGallery(gcanvas.sideimgs[gcanvas.currentIndex]);
}


function maximizeGalleryImage()
{
    var gcanvas = document.getElementById("gcanvas");
    var gcanvasContainer = document.getElementById("gcanvascontainer");
    gcanvasContainer.classList.add("maximized");
    gcanvas.classList.add("maximizedimg");
    document.body.classList.add("noscroll");
    var btExpand = document.getElementById("btExpand");
    var btCompress = document.getElementById("btCompress");
    btExpand.classList.add("hidden");
    btCompress.classList.remove("hidden");
}
function minimizeGalleryImage()
{
    var gcanvas = document.getElementById("gcanvas");
    var gcanvasContainer = document.getElementById("gcanvascontainer");
    gcanvasContainer.classList.remove("maximized");
    gcanvas.classList.remove("maximizedimg");
    document.body.classList.remove("noscroll");

    var btExpand = document.getElementById("btExpand");
    var btCompress = document.getElementById("btCompress");
    btExpand.classList.remove("hidden");
    btCompress.classList.add("hidden");
}

function submitComment(form)
{
    var fd = new FormData(form);
    if(fd.get("nickName"))
}