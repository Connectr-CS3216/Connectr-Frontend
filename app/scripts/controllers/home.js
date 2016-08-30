'use strict';

angular.module('connectrFrontendApp').controller('HomeCtrl', function(srvAuth, $scope, $location, $window,
  anchorSmoothScroll) {
  var height = $(window).height() + 5;
  var unitHeight = parseInt(height) + 'px';
  $('.homepage').css('height', unitHeight);

  if ($window.FB) {
    FB.XFBML.parse(); // re-render the facebook login button
  }

  $scope.scrollTo = function(id) {
    $location.hash(id);
    anchorSmoothScroll.scrollTo(id);
    $location.hash('');
  };

  $scope.login = function() {
    srvAuth.watchAuthenticationStatusChange();
    FB.login(function(response) {
      if (response.status === 'connected') {
        // Logged into your app and Facebook.
        $location.url('/map');
      }
    }, {
      scope: 'public_profile,email,user_tagged_places,user_friends,publish_actions',
      auth_type: 'rerequest'
    });
  };

});
