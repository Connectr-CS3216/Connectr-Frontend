'use strict';

angular.module('connectrFrontendApp').controller('StatsModalCtrl', function($uibModalInstance, data) {
  var $ctrl = this;
  $ctrl.data = data;

  $ctrl.tabs = [{
    title: 'Friends',
    data: {
      country: {
        most: $ctrl.data.friends.country.most,
        least: $ctrl.data.friends.country.least
      },
      place: {
        most: $ctrl.data.friends.place.most,
        least: $ctrl.data.friends.place.least
      }
    }
  }, {
    title: 'Global',
    data: {
      country: {
        most: $ctrl.data.global.country.most,
        least: $ctrl.data.global.country.least
      },
      place: {
        most: $ctrl.data.global.place.most,
        least: $ctrl.data.global.place.least
      }
    }
  }];

  $ctrl.done = function() {
    $uibModalInstance.dismiss('cancel');
  };
});
