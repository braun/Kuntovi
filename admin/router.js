// setup base application and configure ui.router


app.config(
    function ($stateProvider) {
        $stateProvider

            .state('article', {
                url: "",
                views: {
                    "mainView": { templateUrl: "/admin/modules/article.html", controller: 'article' }
                }
            })
    }
);
