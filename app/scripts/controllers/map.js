'use strict';

/**
 * @ngdoc function
 * @name connectrFrontendApp.controller:MapCtrl
 * @description
 * # MapCtrl
 * Controller of the connectrFrontendApp
 */


angular.module('connectrFrontendApp').controller('MapCtrl', function ($scope, $location, session, srvAuth, apis) {

    $scope.logout = function() {
        srvAuth.logout();
    };

    $scope.collapseClassBinding = {
        'collapse': 'panel-expanded'
    }

    $scope.playButtonClassBinding = {
        'play': 'glyphicon glyphicon-play' 
    }

    $scope.toggleLeftPanel = function() {
        if ($scope.collapseClassBinding.collapse === 'panel-expanded') {
            $scope.collapseClassBinding.collapse = 'panel-collapse'
        } else {
            $scope.collapseClassBinding.collapse = 'panel-expanded'
        }
    }

    var previousCenter, previousZoom
    $scope.walkThrough = function() {
        if ($scope.playButtonClassBinding.play === "glyphicon glyphicon-stop") {
            stopPlaying();
        } else {
            previousCenter = session.map.getCenter();
            previousZoom = session.map.getZoom();

            if (session.checkins) {
                $scope.$broadcast("map.needsRemoveControl");
                $scope.playButtonClassBinding.play = "glyphicon glyphicon-stop"
                if ($scope.collapseClassBinding.collapse === 'panel-expanded') {
                    $scope.collapseClassBinding.collapse = 'panel-collapse'
                }
                playback(0)
            } else {
                alert("data not ready")
            }
        }
    }

    var lastPlaceID, timer
    function stopPlaying() {
        var map = session.map
        map.flyTo({
            center: previousCenter,
            pitch: 0,
            zoom: previousZoom
        })

        window.clearTimeout(timer)
        map.once('moveend', function(){})
        $scope.$broadcast("map.needsDisplayControl");
        $scope.playButtonClassBinding.play = "glyphicon glyphicon-play"
    }

    function playback(index) {
        var map = session.map

        var locations = session.checkins.features

        if (index === locations.length) {
            stopPlaying()
            return
        }

        if (locations[index].properties["place_fb_id"] == lastPlaceID) {
            playback(index + 1)
            return
        } else {
            lastPlaceID = locations[index].properties["place_fb_id"]
        }

        // Animate the map position based on camera properties
        map.flyTo({
            center: locations[index].geometry.coordinates,
            pitch: 45,
            zoom: 16
        })

        map.once('moveend', function() {
            // Duration the slide is on screen after interaction
            timer = window.setTimeout(function() {
                // Increment index
                playback(++index);
            }, 3000); // After callback, show the location for 3 seconds.
        });
    }

    $scope.loadFriendsCheckins = function(friendId) {
        apis.checkins.getFriendsCheckins(
            friendId, {
                'token': session.serverToken(),
                'format': 'geojson'
            }
        ).success(function(data) {
        
        console.log(data);
        
        }).error(function() {
            console.log('failed to load friend\'s data');
        });
    }

    function initialise() {
        $scope.user = {
            name: session.username()
        };

        // retrieve user checkins
        apis.checkins.get({
            'token': session.serverToken(),
            'format': 'geojson'
        }) .success(function(data) {
            session.checkins = data;
            session.checkins.features.sort(function (a, b) {return a.properties.checkin_time < b.properties.checkin_time ? -1 : 1})
            console.log(data)
            // Notify map to read data
            $scope.$broadcast("api.selfCheckinsLoaded", data);
        }).error(function() {
            // TODO: Handle error here
            // redirect to login
            console.log('Token expired. Please re-login.');
            session.save();

            // Force reload of login page to avoid buggy facebook logout
            $location.url('/');
        });

        // retrieve friend list
        /*
        apis.friends.get({
            'token': session.serverToken()
        }) .success(function(data) {
            console.log(data);
            data.forEach(function(friend) {
                $scope.loadFriendsCheckins(friend.id);
            })
        }).error(function() {
            console.log('failed to get friend list');
        });
        */
    }

    initialise();
});
