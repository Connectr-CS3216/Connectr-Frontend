'use strict';

angular.module('connectrFrontendApp').controller('HomeCtrl', function () {
   var height = $(window).height() + 5;
   var unitHeight = parseInt(height) + 'px';
   $('.homepage').css('height',unitHeight);
});
