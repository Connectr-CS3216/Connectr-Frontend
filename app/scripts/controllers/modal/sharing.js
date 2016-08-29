'use strict';

angular.module('connectrFrontendApp').controller('ShareModalCtrl', function ($uibModalInstance, snapshot) {
  var $ctrl = this;
  $ctrl.snapshotUrl = snapshot;
  $ctrl.shareNow = function () {
    $uibModalInstance.close('ok');
  };

  $ctrl.shareCancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});
