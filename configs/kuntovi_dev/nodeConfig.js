
     var config =
     {
         dataSource: './db/datasource_couchdb.js',
        couchOpts: {
    
            host: '10.0.0.42',
            protocol: 'http',
            port: 5984,
          //  auth: {
          //      user: 'login',
          //      pass: 'secret'
           // }
        },
        imagesDb:'kuntaci_images',
        articlesDb: 'kuntaci_articles',
        branding: 'branding-kuntovi',
        httpListenPort: 3000
     }
    module.exports = config;
        
