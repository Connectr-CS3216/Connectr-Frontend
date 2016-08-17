'use strict';

/**
 * @ngdoc overview
 * @name connectrFrontendApp
 * @description
 * # connectrFrontendApp
 *
 * Main module of the application.
 */
angular
  .module('connectrFrontendApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .when('/map', {
        templateUrl: 'views/map.html',
        controller: 'MapCtrl',
        controllerAs: 'map'
      })
      .otherwise({
        redirectTo: '/'
      });
  });


var drag = false;

document.addEventListener('mousedown', function(e) {
    drag = false;
    var x = e.clientX;
    var y = e.clientY;

    document.addEventListener('mousemove', function(e) {
        if (Math.abs(e.clientX - x) || Math.abs(e.clientY - y) > 1)
            drag = true;
    });
});

document.addEventListener('mouseup', function() {
    document.removeEventListener('mousemove');
});