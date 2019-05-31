(function(){
  'use strict';

  var mongoose = require('mongoose');
  var article = {
    url : {type : String },
    heading : {type : String },
    summary : {type : String },
    image : {type : String },
    publishTime : {type : String },
    updatedAt : {type : String},
    keywords : {type : Array},
    createdAt : { type : Date , default : Date.now() }
  };
  var ArticleSchema = new mongoose.Schema(article);
  var Article = mongoose.model('Article',ArticleSchema);

  module.exports = Article;
})();
