'use strict';

angular.module('connectrFrontendApp').controller('HomeCtrl', function ($scope, $location, $window) {
  var height = $(window).height() + 5;
  var unitHeight = parseInt(height) + 'px';
  $('.homepage').css('height',unitHeight);

  $scope.isActive = function (viewLocation) { 
      return viewLocation === $location.path();
  };
  
  if ($window.FB) {
    FB.XFBML.parse(); // re-render the facebook login button
  }

});
