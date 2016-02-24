'use strict';
/**
 * Created by stevenbarnhurst on 1/22/16.
 */

var app = angular.module('core');

app.directive('mcWidget', function($http, $rootScope, $sce) {
  return {
    restrict: 'E',
    scope: {
      data: '='
    },
    controller: function($scope, $element) {
      //init state
      $scope.widgetOpen = false;

      $scope.close = function() {
        $scope.widgetOpen = false;
      };

      // When a show element is clicked, it triggers this.
      $rootScope.$on('player.play', function (event, args){
        // URL is not safe according to angular
        $scope.current_mc_track = $sce.trustAsResourceUrl('https://www.mixcloud.com/widget/iframe/?feed=' + args.url + '&hide_cover=1&mini=1&autoplay=1');
        $scope.widgetOpen = true;
      });

      // turns off mc widget when other audio element is played
      $rootScope.$on('audio.play', function (){
        $scope.widgetOpen = false;
      });

    },
    templateUrl: 'modules/core/client/views/components/mcwidget.html'
  };
});