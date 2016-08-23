'use strict';

/**
 * @ngdoc function
 * @name connectrFrontendApp.controller:MapCtrl
 * @description
 * # MapCtrl
 * Controller of the connectrFrontendApp
 */

angular.module('connectrFrontendApp').controller('MapCtrl', function ($scope, $location, session, srvAuth) {

  $scope.logout = function() {
    srvAuth.logout();
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

  function initialise() {
    $scope.user = {
      name: session.username()
    };
  }

  initialise();
});
