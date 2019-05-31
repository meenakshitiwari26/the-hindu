(function (){
  'use strict';
  var cheerio = require('cheerio');

  module.exports = function(app,request,configs,Article){

    app.get('/thehindu', function(req, res){
      var year = parseInt(req.query.year);
		  var month = parseInt(req.query.month);
		  var day = parseInt(req.query.day);
  		if(year !== undefined && month !== undefined && day !== undefined){
        var url = "https://www.thehindu.com/archive/web/"+year+"/"+month+"/"+day+"/";
        console.log(url);
  			request.get({
  				url: url
  			}, function(err,response,html){
          if(!err){
            var $ = cheerio.load(html);
            var lis = $('.archive-list').find('li');
            var as = $(lis).find('a');
            var hrefArr = [];
            as.each(function(key,item){
               var t = {};
               t['url'] = $(item).attr('href');
               const url = t['url'];
               var article = Article.collection.initializeUnorderedBulkOp();
               article.find({'url': t['url']}).upsert().updateOne(t);

               article.execute(function (err, res) {
                   if (!err) {
                       console.log('article bulk op',res);
                   } else {
                       console.log('error at article bulk', err);

                   }
               })
               metaData(url, (err, data)=>{
                 if(!err){
                   console.log(data);
                 }else {
                   console.log("error occured in finding metaData"+ err);
                 }
               })
            });
          }
  				});

  			}else {
  				console.log("pls enter the year month and date in the url");
  			}
		});


    function metaData(url, cb){
      request.get({
        url : url
      },(err,response,body)=>{
        if(!err){
          try{
            var $ = cheerio.load(body);
            var s = $('script');
            for(var prop in s){
                if($(s[prop]).attr('type') == 'application/ld+json'){
                  let t = JSON.parse($(s[prop]).html());
                  if(t['@type'] == 'NewsArticle') {
                    var params = {};
                    params['url'] = url;
                    params['heading'] = t['headline'];
                    params['description'] = t['description'];
                    params['keywords'] = t['keywords'];
                    params['datePublished'] = t['datePublished'];
                    params['dateModified'] = t['dateModified'];
                    params['image'] = t['image']['url'];

                    Article.update({
                        'url': url
                    }, {
                        $set: {'url': params['url'], 'heading': params['heading'], 'summary': params['description'], 'keywords': params['keywords'], 'publishTime' : params['datePublished'], 'updatedAt': params['dateModified'], 'image': params['image']}
                    }, {upsert: true}).exec(function (err, results) {
                        if (!err) {
                            cb(undefined, true);
                        } else {
                            cb(err, null);
                        }
                    })
                  }
                }
            }
          }catch(e){
            console.log('e', e);
          }
        }
      })
    }
  }
})();
