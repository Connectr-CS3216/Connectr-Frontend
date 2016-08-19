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

  $scope.collapseClassBinding = {
    'collapse': 'panel-expanded'
  }

  $scope.toggleLeftPanel = function() {
    if ($scope.collapseClassBinding.collapse === 'panel-expanded') {
      $scope.collapseClassBinding.collapse = 'panel-collapse'
    } else {
      $scope.collapseClassBinding.collapse = 'panel-expanded'
    }

    console.log($scope.collapseClassBinding)
  }

  function initialise() {
    $scope.user = {
      name: session.username()
    };
  }

  initialise();
});
