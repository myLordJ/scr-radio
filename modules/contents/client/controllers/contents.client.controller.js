'use strict';

// Contents controller
//noinspection JSAnnotator
angular.module('contents').controller('ContentsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Contents', '$rootScope',
  function ($scope, $stateParams, $location, Authentication, Contents, $rootScope) {
    $scope.authentication = Authentication;
    $scope.tile_limit = 120;
    $scope.rowLength = 4;

    // Remove existing Content
    $scope.removeContent = function (content) {
      if (content) {
        content.$remove();

        for (var i in $scope.contents) {
          if ($scope.contents[i] === content) {
            $scope.contents.splice(i, 1);
          }
        }
      } else {
        $scope.content.$remove(function () {
          $location.path('contents');
        });
      }
    };
    $rootScope.changeBg($scope.defaultBg);

    // Find a list of Contents
    $scope.find = function () {
      var query = $stateParams.contentType ? {category: $stateParams.contentType} : {};
      $scope.contentType = $stateParams.contentType;
      $scope.contents = Contents.query(query, function (data) {
        $scope.changeBg($scope.defaultBg);
      });
    };

    // Find existing Content
    $scope.findOne = function () {
      console.log($stateParams.contentId);
      $scope.content = Contents.get({
        contentId: $stateParams.contentId
      }, function (data) {
        console.log(data);
        $scope.changeBg(data.image);
      });
    };

  }
]);
