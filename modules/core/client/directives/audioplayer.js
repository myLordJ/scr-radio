'use strict';
//noinspection JSAnnotator
/**
 * Created by stevenbarnhurst on 11/2/15.
 * TODO: Add a buffering icon to the play/pause button cycle
 */

angular.module('core').directive('audioPlayer', function ($rootScope, $document, $timeout, $http, $mdDialog, $mdMedia) {
  return {
    restrict: 'E',
    scope: {},
    link: function ($scope, $element) {
      // for metadata
      var timeout;
      var resetTimer = 20000;
      $scope.defaultText = 'All our Residents are currently getting their beauty sleep.';
      var timer = resetTimer;
      var timeNow;
      var timeEnd;
      var diffMs;

      var radio = $document[0].createElement('audio');
      radio.src = 'http://seoulcommunityradio.out.airtime.pro:8000/seoulcommunityradio_a?1466567397161.mp3';
      var player = {};
      player.isPlaying = false;

      $scope.showAdvanced = function(ev) {
        console.log('here');
        var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
        $mdDialog.show({
          controller: DialogController,
          templateUrl: '/modules/contents/client/views/livestream.client.view.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:true,
          fullscreen: useFullScreen
        })
          .then(function(answer) {
            $scope.status = 'You said the information was "' + answer + '".';
          }, function() {
            $scope.status = 'You cancelled the dialog.';
          });
        $scope.$watch(function() {
          return $mdMedia('xs') || $mdMedia('sm');
        }, function(wantsFullScreen) {
          $scope.customFullscreen = (wantsFullScreen === true);
        });
      };

      function DialogController($scope, $mdDialog) {
        $scope.hide = function() {
          $mdDialog.hide();
        };
        $scope.cancel = function() {
          $mdDialog.cancel();
        };
        $scope.answer = function(answer) {
          $mdDialog.hide(answer);
        };
      }

      function getMetadata() {
        $http.jsonp("https://seoulcommunityradio.airtime.pro/api/live-info-v2", {
          params: {
            format: 'jsonp',
            callback: 'JSON_CALLBACK'
          }
        }).then(
          function (data) {
            data = data.data;
            console.log(data.tracks);
            if ($scope.metadata && data.tracks && data.tracks.current && data.tracks.current.name === $scope.metadata.tracks.current.name) { // try again in ten
              timer = 10000; // check in 10 seconds
              setTimer(timer); // start new timeout
            } else if (data.tracks.current) {
              $scope.metadata = data; // set metadata
              timeNow = new Date(data.station.schedulerTime);
              var endDateTime = data.tracks.next ? data.tracks.next.starts : data.tracks.current.ends;
              timeEnd = new Date(endDateTime);
              timer = timeEnd.getTime() - timeNow.getTime() + 100;
              setTimer(timer);  // create new timeout based on metadata
            } else {
              setTimer(resetTimer); // check periodically for new metadata till radio begins again
            }
          }, function (err) {
            console.log(err);
          }
        );
      }

      function setTimer(interval) {
        $timeout.cancel(timeout);
        timeout = $timeout(function() {
          getMetadata();
        }, interval);
      }

      player.volumeChange = function (direction) {
        if (direction === 'up' && radio.volume < 1.0) {
          radio.volume = Math.round((radio.volume+0.1) * 100)/100;
          $scope.opacityPlus = {opacity: 1-(radio.volume*0.6)};
          $scope.opacityMinus = {opacity: 0.4+(radio.volume*0.6)};
        } else if (direction === 'down' && radio.volume > 0.0) {
          radio.volume = Math.round((radio.volume-0.1) * 100)/ 100;
          $scope.opacityPlus = {opacity: 1-(radio.volume*0.6)};
          $scope.opacityMinus = {opacity: 0.4+(radio.volume*0.6)};
        }
      };

      player.playPause = function () {
        if (player.isPlaying) {
          radio.pause();
          $timeout.cancel(timeout);
          player.isPlaying = false;
        } else {
          radio.play();
          player.isPlaying = true;
          $rootScope.$broadcast('audio.play', this);
        }
      };

      // Pause HTML audio on the instantiation of a player
      $scope.$on('player.play', function () {
        radio.pause();
      });

      $scope.player = player;
      $scope.radio = radio;
      radio.volume = 0.5;
      $scope.opacityPlus = {opacity: 1-(radio.volume*0.6)};
      $scope.opacityMinus = {opacity: 0.4+(radio.volume*0.6)};

      setTimer(10);
    },

    templateUrl: 'modules/core/client/views/components/audio-player.html'
  };
});
