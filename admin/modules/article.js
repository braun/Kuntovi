/**
 * Created by stani on 17.03.2017.
 */
app.controller('article', ["$scope", "$state", "$http", function ($scope, $state, $http) {
    $scope.tinymceOptions = {
        plugins: 'link image code',
        toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | code'
    };

    $scope.article = loadLs("article", function () {
        var article = {
            header: {
                date: new Date()
            }
        };
        return article;
    });

    $scope.fotoSelected = function () {
        var file = event.target.files[0];
        if (file == null)
            return;

        resizeImage(blob,800,600,function(blob) {
            if(blob == null)
            {
                toast("Nepodařilo se nastavit titulní obrázek");
                return;
            }
            $scope.$apply(function () {
                var urlCreator = window.URL || window.webkitURL;
                var imageUrl = urlCreator.createObjectURL(blob);
                $scope.titlePhoto = imageUrl;
                $scope.titlePhotoBlob = blob;
                toast("Titulní obrázek nastaven");
            });
        });


    };

    $scope.saveArticle = function () {
        // toast("Ukladam");
        saveLs($scope.article);
        $http.post(
            "/content/clanky/" + $scope.article.header.title,
            $scope.article, {headers: {'Content-Type': 'application/json'}}).then(
            function (res) {

                toast("Článek uložen");
                if ($scope.titlePhotoBlob != null)
                    $http.post(
                        "/content/clanky/" + $scope.article.header.title + "/titlePhoto.jpg",
                        $scope.titlePhotoBlob, {headers: {'Content-Type': $scope.titlePhotoBlob.type}}).then(
                        function (res) {
                            toast("Uložena titulní fotografie");
                        }, function (res) {
                            toast("Chyba při ukkládání titulní fotografie");
                        });

            }, function (res) {
                toast("Chyba při ukládání článku");
            });
    }
}]);
