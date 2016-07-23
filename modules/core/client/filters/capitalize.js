/**
 * Created by stevenbarnhurst on 2/23/16.
 */

'use strict';
//noinspection JSAnnotator
angular.module('core').filter('capitalize', function() {
  return function(input, all) {
    if (typeof(input) === 'string') {
      var reg = (all) ? /([^\W_]+[^\s-]*) */g : /([^\W_]+[^\s-]*)/;
      return (!!input) ? input.replace(reg, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}) : '';
    }
  };
});