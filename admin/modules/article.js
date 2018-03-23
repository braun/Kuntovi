/**
 * Created by stani on 17.03.2017.
 */
app.controller('article', ["$scope", "$state", "$http", function ($scope, $state, $http) {
    $scope.tinymceOptions = {
        plugins: 'link image code',
        toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | code'
    };


$scope.isCategorySet = function(category)
{
    if($scope.article == null)
        return false;
    if($scope.article.categories == null)
        $scope.article.categories = [];
    return $scope.article.categories.indexOf(category) != -1;
}
$scope.setCategory = function(category)
{
    var idx = $scope.article.categories.indexOf(category);
    if(idx == -1)
        $scope.article.categories.push(category);
    else
        $scope.article.categories.splice(idx,1);
}
    $scope.editTitlePhoto = function()
    {
        var el = document.getElementById("#titlePhoto");
        $scope.isTitlePhotoEdited = true;
       var dkrm = new Darkroom('#titlePhoto',
            {
              
                    saveCallback:  function() {
                         dkrm.originalImageElement.style.display = "block";
                        var e = dkrm.canvas.getElement();
                            e.toBlob(function(blob)
                            {
                                $scope.$apply(function () {
                                    var urlCreator = window.URL || window.webkitURL;
                                    var imageUrl = urlCreator.createObjectURL(blob);
                                    $scope.db.setTitlePhoto($scope.article, blob);
                                    $scope.setTitlePhoto(imageUrl);
                                    $scope.isTitlePhotoEdited = false;
                    
                                });
                            }, "image/jpeg", 0.95);
                        }
                    
                
            });    
    }

    $scope.showButtonsTitlePhoto = function()
    {
        return $scope.titlePhoto != null && $scope.isTitlePhotoEdited == false; 
    }
    $scope.showButtonsPhoto = function(photo)
    {
        return !photo.isEdited; 
    }
    $scope.editPhoto = function(id)
    {
           
            var el = document.getElementById("#"+id.doc._id);
            id.isEdited = true;
            var dkrm = new Darkroom("#"+id.doc._id,
                 {
                   
                         saveCallback:  function() {
                            id.isEdited = false;
                             dkrm.originalImageElement.style.display = "block";
                             var e = dkrm.canvas.getElement();
                                 e.toBlob(function(blob)
                                 {
                                    resizeImageHermit(blob, 320, 180, function (thumb) {
                                        if (thumb == null) {
                                            toast("Nepodařilo se vytvořit náhled obrázku");
                                            return;
                                        }
                        
                        
                                        var urlCreator = window.URL || window.webkitURL;
                                        var imageUrl = urlCreator.createObjectURL(blob);
                        
                                        $scope.db.setImage(id.doc, blob, thumb, function (imgDoc) {
                                            $scope.$apply(function () {

                                                id.doc = imgDoc;
                                                id.url = dkrm.originalImageElement.src;
                                            });
                                        });
                        
                        
                                    });
                                 }, "image/jpeg", 0.95);
                             }
                         
                     
                 });      
    }
    $scope.fotoSelected = function () {
        var file = event.target.files[0];
        if (file == null)
            return;

        resizeImageHermit(file, 1067, 601, function (blob) {
            if (blob == null) {
                toast("Nepodařilo se nastavit titulní obrázek");
                return;
            }
            $scope.$apply(function () {
                var urlCreator = window.URL || window.webkitURL;
                var imageUrl = urlCreator.createObjectURL(blob);
                $scope.db.setTitlePhoto($scope.article, blob);
                $scope.setTitlePhoto(imageUrl);


            });
        },true);


    };

    $scope.prepareImageToGallery = function (file) {
        resizeImageHermit(file, 1600, 900, function (blob) {
            if (blob == null) {
                toast("Nepodařilo se přidat obrázek");
                return;
            }

            resizeImageHermit(file, 320, 180, function (thumb) {
                if (thumb == null) {
                    toast("Nepodařilo se vytvořit náhled obrázku");
                    return;
                }


                var urlCreator = window.URL || window.webkitURL;
                var imageUrl = urlCreator.createObjectURL(blob);

                $scope.db.addGalleryPhoto($scope.article, blob, thumb, function (imgDoc) {
                    $scope.$apply(function () {
                        $scope.addGalleryPhoto({
                            doc: imgDoc,
                            url: imageUrl
                        });
                        toast("Obrázek přidán do galerie");
                    });
                });


            });

        });
    }
    $scope.gallerySelected = function () {
        var file = event.target.files[0];
        if (event.target.files == null || event.target.files.length == 0 || file == null)
            return;

        for (var i = 0; i < event.target.files.length; i++) {
            var file = event.target.files[i];
            $scope.prepareImageToGallery(file);

        };


    };
    $scope.deleteGalleryItem = function (galit) {
        $scope.gallery.splice($scope.gallery.indexOf(galit), 1);
        $scope.db.removeGalleryItem(galit.doc, function () {
            $scope.$apply(function () {
                $scope.loadGallery();
            })
        });

    }

}]);