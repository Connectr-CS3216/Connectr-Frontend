'use strict';

angular.module('connectrFrontendApp')
  .controller('LoginCtrl', function($scope, $location, $auth, $http, session) {

    // user data to be stored in session
    var data = {};

    $scope.login = function(provider) {
      $auth.authenticate(provider)
      .then(function() {
        // Signed in
        redirect();
      })
      .catch(function() {

      });
    };

    function redirect() {
      if ($auth.isAuthenticated()) {
        // Signed in
        data.accessToken = $auth.getToken();
        $http.get('https://graph.facebook.com/v2.7/me')
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

    $scope.logout = function() {
      $auth.logout();
      // clear session
      session.save();
    }

    function initialise() {
      redirect();
    }

    $auth.logout();
    //initialise();

  });