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
  .service('session', function session($window /*, $rootScope*/) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    
    // window.localStorage key
    var LOCAL_STORAGE_ID = 'connectrSession';

    function saveToDisk(data) {
      if (data) {
        $window.localStorage[LOCAL_STORAGE_ID] = JSON.stringify(data);
      } else {
        delete $window.localStorage[LOCAL_STORAGE_ID];
      }
    }

    function loadFromDisk() {
      try {
        return JSON.parse($window.localStorage[LOCAL_STORAGE_ID]);
      } catch (e) {
        return null;
      }
    }

    var _session = loadFromDisk(); 
    
    // Data contains fbtoken, serverToken, userid, username,
    // Can be null to clear session
    this.save = function(data) {
      _session = data;
      saveToDisk(_session);
    };

    // Read-only getters
    this.isEmpty = function () { return !_session; };
    this.fbToken = function () { return _session && _session.fbToken || ''; };
    this.serverToken = function () { return _session && _session.serverToken || ''; };
    this.userid = function() { return _session && _session.userid || ''; };
    this.username = function() { return _session && _session.username || ''; };

  });