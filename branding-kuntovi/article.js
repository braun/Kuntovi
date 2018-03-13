function changeBanner(element)
{
    var src = element.src;
    var bannerElement= document.getElementById("bannerImage");
    if(bannerElement == null)
        return;
    
        bannerElement.src = src;
}