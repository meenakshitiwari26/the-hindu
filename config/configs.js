(function() {
  'use strict';

  const settings = require('../settings');

  const Config = function(){
      switch(process.env.NODE_ENV){
          case 'development':
              return settings['development'];
          default:
              return { 'message' : 'could not find configs file '};
      }
  };

  module.exports = Config();

})();
