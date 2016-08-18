'use strict';

/**
 * @ngdoc function
 * @name connectrFrontendApp.controller:MapCtrl
 * @description
 * # MapCtrl
 * Controller of the connectrFrontendApp
 */

angular.module('connectrFrontendApp').controller('MapCtrl', ['$scope', 'session', 
  function ($scope, session) {
    console.log(session.accessToken());
    console.log(session.userid());
    console.log(session.username());
  }
]);
