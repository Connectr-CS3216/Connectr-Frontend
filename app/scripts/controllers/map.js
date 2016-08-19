'use strict';

/**
 * @ngdoc function
 * @name connectrFrontendApp.controller:MapCtrl
 * @description
 * # MapCtrl
 * Controller of the connectrFrontendApp
 */

angular.module('connectrFrontendApp').controller('MapCtrl', function ($scope, $location, session, $auth) {

  $scope.logout = function() {
    $auth.logout();
    // clear session
    session.save();
    $location.url('/login');
  };

  function initialise() {
    $scope.user = {
      name: session.username()
    };
  }

  initialise();

  console.log(session.accessToken());
  console.log(session.userid());
  console.log(session.username());
});
