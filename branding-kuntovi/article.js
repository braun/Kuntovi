function changeBanner(element)
{
    var src = element.src.replace("thumb","image");
    var bannerElement= document.getElementById("bannerImage");
    if(bannerElement == null)
        return;
    
        bannerElement.src = src;
}