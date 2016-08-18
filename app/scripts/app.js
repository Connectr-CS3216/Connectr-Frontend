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
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl',
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .when('/map', {
        templateUrl: 'views/map.html',
        controller: 'MapCtrl',
        controllerAs: 'map',
        requiredLogin: true
      })
      .otherwise({
        redirectTo: '/'
      });

    $authProvider.httpInterceptor = function() { return true; };
    $authProvider.withCredentials = false;
    $authProvider.tokenRoot = null;
    $authProvider.baseUrl = '/';
    $authProvider.loginUrl = '/auth/login';
    $authProvider.signupUrl = '/auth/signup';
    $authProvider.unlinkUrl = '/auth/unlink/';
    $authProvider.tokenName = 'token';
    $authProvider.tokenPrefix = 'satellizer';
    $authProvider.tokenHeader = 'Authorization';
    $authProvider.tokenType = 'Bearer';
    $authProvider.storageType = 'localStorage';

    // Facebook
    $authProvider.facebook({
      name: 'facebook',
      url: '/auth/facebook',
      authorizationEndpoint: 'https://www.facebook.com/v2.5/dialog/oauth',
      redirectUri: window.location.origin + '/login',
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
  .run(function ($rootScope, $location, $auth) {
      $rootScope.$on('$routeChangeStart', function(e, curr, prev){
        if (prev && prev.requiredLogin && !$auth.isAuthenticated()) {
          // reload the login route
          $location.url('/login');
        }
        /*
        * IMPORTANT:
        * It's not difficult to fool the previous control,
        * so it's really IMPORTANT to repeat server side
        * the same control before sending back reserved data.
        */
      });
  });