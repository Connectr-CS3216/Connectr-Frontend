'use strict';

/**
 * @ngdoc service
 * @name connectrFrontendApp.session
 * @description
 * # apis
 * Service in the connectrFrontendApp.
 * Wrapper for https.
 */
angular.module('connectrFrontendApp')
  .service('srvAuth', function srvAuth(session, apis, $location, $rootScope, $window) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    this.watchAuthenticationStatusChange = function() {
      var _self = this;

      FB.Event.subscribe('auth.authResponseChange', function(res) {
        
        if (res.status === 'connected') {
          _self.saveSession(res.authResponse.accessToken);

        } else {
          /*
           The user is not logged to the app, or into Facebook:
           destroy the session on the server.
          */
         _self.logout();
        }
      });
    };

    this.saveSession = function(accessToken) {
      FB.api('/me', function(res) {
        $rootScope.$apply(function() {

          session.save({
            accessToken: accessToken,
            userid: res.id,
            username: res.name
          });

          $location.url('/map');
        });
      });
    };

    this.logout = function() {
      FB.logout(function(/*res*/) {
        $rootScope.$apply(function() {
          session.save();

          // Force reload of login page to avoid buggy facebook logout
          $window.location.href = '/';
          $window.reload();
        });
      });
    };

  });