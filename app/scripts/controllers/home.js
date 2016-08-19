'use strict';

angular.module('connectrFrontendApp').controller('HomeCtrl', function ($scope, $location) {
  var height = $(window).height() + 5;
  var unitHeight = parseInt(height) + 'px';
  $('.homepage').css('height',unitHeight);
});
