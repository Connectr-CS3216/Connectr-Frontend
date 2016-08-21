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
    'ngTouch',
    'satellizer'
  ])
  .config(function ($routeProvider, $authProvider, fbid) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/home.html',
        controller: 'HomeCtrl',
        isLogin: true
      })
      .when('/map', {
        templateUrl: 'views/map.html',
        controller: 'MapCtrl',
        controllerAs: 'map'
      })
      .otherwise({
        redirectTo: '/'
      });

    $authProvider.httpInterceptor = function() { return true; };
    $authProvider.withCredentials = false;
    $authProvider.tokenRoot = null;
    $authProvider.baseUrl = '/';
    $authProvider.tokenName = 'token';
    $authProvider.tokenPrefix = 'satellizer';
    $authProvider.tokenHeader = 'Authorization';
    $authProvider.tokenType = 'Bearer';
    $authProvider.storageType = 'localStorage';

    // Facebook
    $authProvider.facebook({
      name: 'facebook',
      authorizationEndpoint: 'https://www.facebook.com/v2.5/dialog/oauth',
      requiredUrlParams: ['display', 'scope'],
      scope: ['email', 'user_tagged_places'],
      scopeDelimiter: ',',
      display: 'popup',
      oauthType: '2.0',
      popupOptions: { width: 580, height: 400 },
      clientId: fbid,
      responseType: 'token'
    });
  })
  .run(function ($rootScope, $location, $auth, session) {
      $rootScope.$on('$routeChangeStart', function(e, next){
        if (session.isEmpty() && !next.isLogin) {
          // reload the login route
          $location.url('/');
        }
      });
  });
