'use strict';

angular.module('connectrFrontendApp')
  .controller('LoginCtrl', function($scope, $location, $auth, $http, session, apis) {

    // user data to be stored in session
    var data = {};

    $scope.login = function(provider) {
      console.log('here');

      $auth.authenticate(provider)
      .then(function() {
        // Signed in

        // Uncomment this to test server
        apis.verifyFacebookToken.post(
          {
            "access_token": $auth.getToken()
          }
        ).success(function(data) {
          console.log('success', data);

          apis.whoAmI.get({
            'token': data
          })
          .success(function(data) {
            console.log('whoami', data);
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

          // For testing
          // console.log(session.accessToken());
          // console.log(session.userid());
          // console.log(session.username());
           
          $location.url('/map');
        });
      } else {
         $location.url('/login');
      }
    }

    // $scope.logout = function() {
    //   $auth.logout();
    //   // clear session
    //   session.save();
    // };

    // function initialise() {
    //   redirect();
    // }

    $auth.logout();
    //initialise();

  });