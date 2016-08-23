'use strict';

/**
 * @ngdoc function
 * @name connectrFrontendApp.controller:MapCtrl
 * @description
 * # MapCtrl
 * Controller of the connectrFrontendApp
 */

angular.module('connectrFrontendApp').controller('MapCtrl', function ($scope, $location, session, $auth, apis) {

  $scope.logout = function() {
    $auth.logout();
    // clear session
    session.save();
    $location.url('/');
  };

  $scope.collapseClassBinding = {
    'collapse': 'panel-expanded'
  }

  $scope.toggleLeftPanel = function() {
    if ($scope.collapseClassBinding.collapse === 'panel-expanded') {
      $scope.collapseClassBinding.collapse = 'panel-collapse'
    } else {
      $scope.collapseClassBinding.collapse = 'panel-expanded'
    }

    //console.log($scope.collapseClassBinding)
  }

  $scope.walkThrough = function() {
    if (session.checkins) {
      if ($scope.collapseClassBinding.collapse === 'panel-expanded') {
        $scope.collapseClassBinding.collapse = 'panel-collapse'
      }
      playback(0)
    } else {
      alert("data not ready")
    }
  }

  var lastPlaceID
  function playback(index) {
    var map = session.map
    var locations = session.checkins.features

    if (index === locations.length) {
      map.flyTo({
        center: [103.8198, 1.3521],
        pitch: 0,
        zoom: 9
      })

      return
    }

    if (locations[index].properties["place_fb_id"] == lastPlaceID) {
      playback(index + 1)
      return
    } else {
      lastPlaceID = locations[index].properties["place_fb_id"]
    }

    // title.textContent = locations[index].title;
    // description.textContent = locations[index].description;

    // highlightBorough(locations[index].id ? locations[index].id : '');

    // Animate the map position based on camera properties
    map.flyTo({
      center: locations[index].geometry.coordinates,
      pitch: 60,
      zoom: 16
    })

    map.once('moveend', function() {
        // Duration the slide is on screen after interaction
        window.setTimeout(function() {
            // Increment index
            playback(++index);
        }, 3000); // After callback, show the location for 3 seconds.
    });
  }

  function initialise() {
    $scope.user = {
      name: session.username()
    };
  }

  initialise();
});
