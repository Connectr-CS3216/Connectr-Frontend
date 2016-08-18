'use strict';

/**
 * @ngdoc service
 * @name connectrFrontendApp.session
 * @description
 * # session
 * Service in the connectrFrontendApp.
 * This is a simple repository for keeping track of the current user, her roles, etc.
 */
angular.module('connectrFrontendApp')
  .service('session', function session(/*$window, $rootScope*/) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    
    var _session; 
    
    // Data contains access token, userid, username
    this.save = function(data) {
      _session = data;
    };

    // Read-only getters
    this.accessToken = function () { return _session && _session.accessToken || ''; };
    this.userid = function() { return _session && _session.userid || ''; };
    this.username = function() { return _session && _session.username || ''; };

  });