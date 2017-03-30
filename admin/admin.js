/**
 * Created by stani on 17.03.2017.
 */

var app = angular.module("app", ["ui.router", 'ui.tinymce', 'angular-loading-bar']);
app.controller('topController', ['$rootScope', '$scope', '$state', "$http", function ($rootScope, $scope, $state, $http) {
    $scope.lastWork = [];
    $http.get("/content/clanky").then(function (res) {
            $scope.lastWork = [];
            var articles = res.data;
            for (articleid in articles) {
                var article = articles[articleid];
                $scope.lastWork.push(article);
            }
        },
        function (res) {
            toast("Nepodařilo se načíst poslední články");
        });

    $scope.printDate = function (date) {
        var d = braunjs.printDate(date);
        return d;
    }
}]);

app.directive('customOnChange', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var onChangeFunc = scope.$eval(attrs.customOnChange);
            element.bind('change', onChangeFunc);
        }
    };
});
