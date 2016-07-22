'use strict';
//noinspection JSAnnotator
/**
 * Created by stevenbarnhurst on 11/2/15.
 * TODO: Add a buffering icon to the play/pause button cycle
 */

angular.module('core').directive('audioPlayer', function ($rootScope, $document, $timeout, $http) {
  return {
    restrict: 'E',
    scope: {},
    link: function ($scope, $element) {
      // for metadata
      var timeout;
      var timer = 50;
      var timeNow;
      var timeEnd;
      var diffMs;

      var radio = $document[0].createElement('audio');
      radio.src = 'http://seoulcommunityradio.out.airtime.pro:8000/seoulcommunityradio_a?1466567397161.mp3';
      var player = {};
      player.isPlaying = false;

      function getMetadata() {
        $http.jsonp("https://seoulcommunityradio.airtime.pro/api/live-info-v2", {
          // headers: {'content-type': 'application/json'},
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
            } else {
              $scope.metadata = data; // set metadata
              timeNow = new Date(data.station.schedulerTime);
              var endDateTime = data.tracks.next ? data.tracks.next.starts : data.tracks.current.ends;
              timeEnd = new Date(endDateTime);
              timer = timeEnd.getTime() - timeNow.getTime() + 100;
              setTimer(timer);  // create new timeout based on metadata
            }
          }, function (err) {
            console.log(err);
          }
        );
      }

      function setTimer(interval) {
        $timeout.cancel(timeout);
        timeout = $timeout(function() {
          console.log('here');
          getMetadata();
        }, interval);
      }

      player.volumeChange = function (direction) {
        if (radio.volume !== 1.0 && radio.volume !== 0.0) {
          radio.volume = direction === 'up' ? radio.volume+0.05 : radio.volume-0.05;
        }
        if (radio.volume === 1.0) {
          $scope.atMax = true;
        } else if (radio.volume === 0.0) {
          $scope.atMin = true;
        } else {
          $scope.atMax = true;
          $scope.atMin = true;
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
      setTimer(10);
    },
    templateUrl: 'modules/core/client/views/components/audio-player.html'
  };
});
