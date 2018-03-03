/**
 * Created by stani on 17.03.2017.
 */
app.controller('article', ["$scope", "$state", "$http", function ($scope, $state, $http) {
    $scope.tinymceOptions = {
        plugins: 'link image code',
        toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | code'
    };

    

    $scope.fotoSelected = function () {
        var file = event.target.files[0];
        if (file == null)
            return;

        resizeImage(file,800,600,function(blob) {
            if(blob == null)
            {
                toast("Nepodařilo se nastavit titulní obrázek");
                return;
            }
            $scope.$apply(function () {
                var urlCreator = window.URL || window.webkitURL;
                var imageUrl = urlCreator.createObjectURL(blob);
                $scope.db.setTitlePhoto($scope.article,blob);
               $scope.setTitlePhoto(imageUrl);
                
              
            });
        });


    };
    $scope.gallerySelected = function () {
        var file = event.target.files[0];
        if ( event.target.files == null ||  event.target.files.length == 0 || file == null)
            return;

            for(var i = 0; i < event.target.files.length; i++)
            {
                var file =  event.target.files[i];
                resizeImage(file,800,600,function(blob) {
                    if(blob == null)
                    {
                        toast("Nepodařilo se přidat obrázek");
                        return;
                    }
                    $scope.$apply(function () {
                        var urlCreator = window.URL || window.webkitURL;
                        var imageUrl = urlCreator.createObjectURL(blob);
                      $scope.addGalleryPhoto(imageUrl);
                      $scope.db.addGalleryPhoto($scope.article,blob);
                        toast("Obrázek přidán do galerie");
                    });
                });
        
            };
 

    };
    $scope.deleteGalleryItem = function(galit)
    {
        $scope.gallery.splice($scope.gallery.indexOf(galit),1);
        $scope.db.removeGalleryItem(galit.doc);

    }

}]);
