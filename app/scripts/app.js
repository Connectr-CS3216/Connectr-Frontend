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
        templateUrl: 'views/home.html',
        controller: 'HomeCtrl',
        isPublic: true
      })
      .when('/map', {
        templateUrl: 'views/map.html',
        controller: 'MapCtrl',
        controllerAs: 'map'
      })
      .when('/privacy-policy', {
        templateUrl: 'views/privacy-policy.html',
        controller: 'PrivacyPolicyCtrl',
        isPublic: true
      })
      .otherwise({
        redirectTo: '/'
      });
  })
  .run(function ($rootScope, $location, session, srvAuth, $window) {

      $window.fbAsyncInit = function() {
          FB.init({ 
            appId: '631439630344992',
            channelUrl: 'app/channel.html',
            status: true, 
            cookie: true, 
            xfbml: true,
            version: 'v2.4'
          });

          srvAuth.watchAuthenticationStatusChange();
      };

      (function(d){
        // load the Facebook javascript SDK
        var js,
        id = 'facebook-jssdk',
        ref = d.getElementsByTagName('script')[0];

        if (d.getElementById(id)) {
          return;
        }

        js = d.createElement('script');
        js.id = id;
        js.async = true;
        js.src = "//connect.facebook.net/en_US/all.js";

        ref.parentNode.insertBefore(js, ref);
      }(document));

      $rootScope.$on('$routeChangeStart', function(e, next){
        if (session.isEmpty() && !next.isPublic) {
          // reload the login route
          $location.url('/');
        }
      });
  });
