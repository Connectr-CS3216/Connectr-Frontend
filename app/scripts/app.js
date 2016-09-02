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
    'ui.bootstrap',
    'ngToast',
    'ng-walkthrough',
    'ngFlag'
  ])
  .config(function($routeProvider) {
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
      .when('/terms-of-service', {
        templateUrl: 'views/terms-of-service.html',
        controller: 'TermsOfServiceCtrl',
        isPublic: true
      })
      .otherwise({
        redirectTo: '/'
      });
  })
  .config(['ngToastProvider', function(ngToast) {
    ngToast.configure({
      verticalPosition: 'bottom',
      horizontalPosition: 'center',
      maxNumber: 1
    });
  }])
  .run(function($rootScope, $location, session, srvAuth, $window) {

    $window.fbAsyncInit = function() {
      FB.init({
        appId: '631439630344992',
        status: true,
        xfbml: true,
        version: 'v2.7'
      });
    };

    (function(d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {
        return;
      }
      js = d.createElement(s);
      js.id = id;
      js.src = '//connect.facebook.net/en_US/sdk.js';
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));

    $rootScope.$on('$routeChangeStart', function(e, next) {
      if (session.isEmpty() && !next.isPublic) {
        // reload the login route
        $location.url('/');
      }
    });

    $rootScope.$on('$routeChangeSuccess', function() {
      // https://developers.google.com/analytics/devguides/collection/analyticsjs/single-page-applications
      ga('set', 'page', $location.path());
      ga('send', 'pageview');
    });
  });
