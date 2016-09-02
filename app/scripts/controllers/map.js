'use strict';

/**
 * @ngdoc function
 * @name connectrFrontendApp.controller:MapCtrl
 * @description
 * # MapCtrl
 * Controller of the connectrFrontendApp
 */


angular.module('connectrFrontendApp').controller('MapCtrl', function($rootScope, $scope, $location, session,
  srvAuth, apis, $uibModal, ngToast, onboadingPreference) {

  $scope.logout = function() {
    srvAuth.logout();
  };

  $scope.collapseClassBinding = {
    'collapse': 'panel-expanded'
  };

  $scope.playClassBinding = {
    'play': 'fa fa-play',
    'display': 'display-none'
  };

  $scope.toggleLeftPanel = function() {
    if ($scope.collapseClassBinding.collapse === 'panel-expanded') {
      $scope.collapseClassBinding.collapse = 'panel-collapse';
    } else {
      $scope.collapseClassBinding.collapse = 'panel-expanded';
    }
  };

  $scope.walkThrough = function() {
    if ($scope.playClassBinding.play === 'fa fa-stop') {
      stopPlaying();
    } else {
      startPlaying();
    }
  };

  $scope.onboardingDone = function() {
    onboadingPreference.setViewed();
  };

  // Get Stats data
  apis.stats.get({
    'token': session.serverToken()
  }).success(function(data) {
    $scope.statsData = data;
  });

  $scope.showStats = function() {
    $uibModal.open({
      animation: true,
      templateUrl: 'stats.html',
      controller: 'StatsModalCtrl',
      controllerAs: '$ctrl',
      size: 'md',
      resolve: {
        data: $scope.statsData
      }
    });
  };

  var lastPlaceID, timer, previousCenter, previousZoom;

  function startPlaying() {
    previousCenter = session.map.getCenter();
    previousZoom = session.map.getZoom();

    if (session.checkins) {
      $scope.$broadcast('map.needsRemoveControl');
      $scope.playClassBinding.play = 'fa fa-stop';
      $scope.playClassBinding.display = 'display-normal';
      if ($scope.collapseClassBinding.collapse === 'panel-expanded') {
        $scope.collapseClassBinding.collapse = 'panel-collapse';
      }
      playback(0);
    } else {
      ngToast.danger({
        content: 'Data is not loaded :('
      });
    }
  }

  function stopPlaying() {
    var map = session.map;
    map.stop();
    map.flyTo({
      center: previousCenter,
      pitch: 0,
      zoom: previousZoom
    });

    window.clearTimeout(timer);
    map.once('moveend', function() {});
    $scope.$broadcast('map.needsDisplayControl');
    $scope.playClassBinding.play = 'fa fa-play';
    $scope.playClassBinding.display = 'display-none';
  }

  function playback(index) {
    var map = session.map;

    var locations = session.checkins.features;

    if (index === locations.length) {
      stopPlaying();
      return;
    }

    if (locations[index].properties['place_fb_id'] === lastPlaceID) {
      playback(index + 1);
      return;
    } else {
      lastPlaceID = locations[index].properties['place_fb_id'];
    }

    updateDisplayContentForFeature(locations[index]);

    map.flyTo({
      center: locations[index].geometry.coordinates,
      pitch: 45,
      zoom: 16
    });

    map.once('moveend', function() {
      timer = window.setTimeout(function() {
        playback(++index);
        $scope.$apply();
      }, 3000);
    });
  }

  function updateDisplayContentForFeature(feature) {
    $scope.displayPlaceName = feature.properties.place_name;
    var timeString = feature.properties['checkin_time'];
    if (timeString) {
      var date = new Date(timeString).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      }).split(' ');

      timeString = date[1] + ' ' + date[0] + ', ' + date[2];
    }
    $scope.displayCheckinTime = timeString;
  }

  $scope.toggleClassBinding = {
    'all': 'glyphicon glyphicon-eye-open'
  };

  $scope.toggleAllCheckins = function() {
    var toggleClassBinding = $scope.toggleClassBinding;
    if (toggleClassBinding.all === 'glyphicon glyphicon-eye-open') {
      toggleClassBinding.all = 'glyphicon glyphicon-eye-close';
      $scope.removeAllCheckins();
    } else {
      toggleClassBinding.all = 'glyphicon glyphicon-eye-open';
      $scope.loadAllCheckins();
    }
  };

  $scope.loadAllCheckins = function() {
    $scope.friends.forEach(function(friend) {
      $scope.loadFriendsCheckins(friend);
    });
    $scope.loadFriendsCheckins($scope.currentUser);
  };

  $scope.removeAllCheckins = function() {
    $scope.friends.forEach(function(friend) {
      $scope.removeFriendsCheckins(friend);
    });
    $scope.removeFriendsCheckins($scope.currentUser);
  };

  $scope.loadFriendsCheckins = function(friend) {
    if (friend.checkins !== undefined) {
      friend.shown = true;
      $scope.$broadcast('map.needsAddCheckinsForFriend', friend);
    } else {
      apis.checkins.getFriendsCheckins(
        friend.id, {
          'token': session.serverToken(),
          'format': 'geojson'
        }
      ).success(function(data) {
        friend.checkins = data;
        friend.shown = true;
        $scope.$broadcast('map.needsAddCheckinsForFriend', friend);
      }).error(function() {});
    }
  };

  $scope.removeFriendsCheckins = function(friend) {
    friend.shown = false;
    $scope.$broadcast('map.needsRemoveCheckinsForFriend', friend);
  };

  $scope.toggleFriend = function(friend) {
    if (!friend.shown) {
      $scope.loadFriendsCheckins(friend);
    } else {
      $scope.removeFriendsCheckins(friend);
    }
  };

  $scope.shareFb = function() {
    var shareModal = $uibModal.open({
      animation: true,
      templateUrl: 'sharing.html',
      controller: 'ShareModalCtrl',
      controllerAs: '$ctrl',
      size: 'lg',
      resolve: {
        snapshot: function() {
          return snapshotURL();
        }
      }
    });

    shareModal.result.then(function() {
      ngToast.info({
        content: 'Sharing... :o'
      });
      apis.shareFb.post({
          'token': session.serverToken()
        }, {
          'data': snapshotURL()
        })
        .success(function() {
          ngToast.success({
            content: 'Sharing succeeded :)'
          });
        })
        .error(function() {
          ngToast.danger({
            content: 'Sharing failed :('
          });
        });
    }, function() {});
  };

  $scope.openFriendModal = function(friend) {
    $uibModal.open({
      animation: true,
      templateUrl: 'friend-modal.html',
      controller: 'FriendModalCtrl',
      size: 'sm',
      resolve: {
        friend: function() {
          return friend;
        }
      }
    });
  };

  function snapshotURL() {
    return session.map.getCanvas().toDataURL();
  }

  function initialise() {
    $scope.user = {
      name: session.username()
    };

    // retrieve user checkins
    apis.checkins.get({
      'token': session.serverToken(),
      'format': 'geojson'
    }).success(function(data) {
      data.features.sort(function(a, b) {
        return a.properties.checkin_time < b.properties.checkin_time ? -1 : 1;
      });
      if (session.currentUser) {
        session.currentUser.checkins = data;
        $scope.toggleFriend(session.currentUser);
      }
      session.checkins = data;
    }).error(function() {
      session.save();
      // Force reload of login page to avoid buggy facebook logout
      $location.url('/');
    });

    apis.currentUser.get({
      'token': session.serverToken()
    }).success(function(data) {
      session.currentUser = data;
      $scope.currentUser = session.currentUser;
      $scope.currentUser.toggle = 'glyphicon glyphicon-eye-close';
      if (session.checkins) {
        session.currentUser.checkins = session.checkins;
        // $scope.$broadcast('api.selfCheckinsLoaded');
        $scope.toggleFriend(session.currentUser);
      }
    });

    // retrieve friend list
    apis.friends.get({
      'token': session.serverToken()
    }).success(function(data) {

      session.friends = {};

      $scope.friends = data;
      $scope.friends.forEach(function(friend) {
        friend.toggle = 'glyphicon glyphicon-eye-close';
        session.friends[friend.id] = friend;
      });

      for (var i = 0; i < data.length; i++) {
        $scope.toggleFriend(data[i]);
      }

      $rootScope.$broadcast('login.finished'); // login finished here.

      // Set walkthrough to true
      $scope.onboard1 = onboadingPreference.hasViewed();
    }).error(function() {
      ngToast.danger({
        content: 'Failed to retrieve friend list :('
      });
    });
  }

  initialise();
});
