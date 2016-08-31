'use strict';

angular.module('connectrFrontendApp')
  .factory('onboadingPreference', function($window) {
    var PREFERENCE_ID = 'connectr-onboarding';
    return {
      setViewed: function() {
        $window.localStorage[PREFERENCE_ID] = "false";
      },
      hasViewed: function() {
        return JSON.parse($window.localStorage[PREFERENCE_ID] || "true");
      },
      remove: function() {
        $window.localStorage.removeItem(PREFERENCE_ID);
      }
    };
  });
