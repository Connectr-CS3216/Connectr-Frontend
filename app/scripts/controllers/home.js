'use strict';

angular.module('connectrFrontendApp').controller('HomeCtrl', function ($scope, $location, $auth, $http, session, apis) {
   var height = $(window).height() + 5;
   var unitHeight = parseInt(height) + 'px';
   $('.homepage').css('height',unitHeight);

   // user data to be stored in session
    var data = {};

    $scope.login = function(provider) {
      $auth.authenticate(provider)
      .then(function() {
        // Signed in

        // // Uncomment this to test server
        apis.verifyFacebookToken.post(
          {
            "access_token": $auth.getToken()
          }
        ).success(function(data) {
          console.log('success', data);
          session.token = data
          apis.checkins.get({
            'token': data,
            'format': 'geojson'
          })
          .success(function(data) {
            console.log('checkins', data);
          });

        }).error(function(err) {
          console.log('failed', err);
        });

        // Uncomment this to direct to map
        redirect();
      });
    };

    function redirect() {
      if ($auth.isAuthenticated()) {
        // Signed in
        data.accessToken = $auth.getToken();
        apis.facebookUser.get()
        .then(function(res) {
          data.userid = res.data.id;
          data.username = res.data.name;
          session.save(data);

          $location.url('/map');
        });
      }
    }

    function initialise() {
      redirect();
    }

    initialise();
});
