'use strict';

angular.module('connectrFrontendApp')
.directive('loading', ['$http', function ($http) {
    return {
        restrict: 'A',
        link: function (scope, elm, attrs) {
            scope.isLoading = false;
            scope.loaded = false;
            scope.$on('login.started', function() {
              if (scope.loaded) {
                scope.loaded = false;
                return;
              }
              elm.show();
            });

            scope.$on('login.finished', function() {
              elm.hide();
              scope.loaded = true;
            });
        }
    };
}]);
