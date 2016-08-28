'use strict';

angular.module('connectrFrontendApp').controller('HomeCtrl', function ($scope, $location, $window, anchorSmoothScroll) {
  var height = $(window).height() + 5;
  var unitHeight = parseInt(height) + 'px';
  $('.homepage').css('height',unitHeight);

  if ($window.FB) {
    FB.XFBML.parse(); // re-render the facebook login button
  }

  $scope.scrollTo = function(id) {
    $location.hash(id);
    anchorSmoothScroll.scrollTo(id);
    $location.hash('');
  };

});
