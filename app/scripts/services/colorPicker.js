'use strict';

/**
 * @ngdoc service
 * @name connectrFrontendApp.session
 * @description
 * # apis
 * Service in the connectrFrontendApp.
 * Wrapper for https.
 */
angular.module('connectrFrontendApp').service('colorPicker', function colorPicker() {

  // http://tools.medialab.sciences-po.fr/iwanthue/ -> palette
  // http://www.color-hex.com/color/3e5468 -> gradient
  var colors = [
    ['#3e5468', '#516577', '#647686', '#778795', '#8b98a4'],
    ['#e8b293', '#eab99d', '#ecc1a8', '#eec9b3', '#f1d0be'],
    ['#6eceea', '#7cd2ec', '#8bd7ee', '#99dcf0', '#a8e1f2'],
    ['#eda4c1', '#eeadc7', '#f0b6cd', '#f2bfd3', '#f4c8d9'],
    ['#79ddcb', '#86e0d0', '#93e3d5', '#a1e7da', '#aeeadf'],
    ['#dfb3e2', '#e2bae4', '#e5c2e7', '#e8c9ea', '#ebd1ed'],
    ['#96d8ab', '#a0dbb3', '#abdfbb', '#b5e3c4', '#c0e7cc'],
    ['#b9b5f3', '#c0bcf4', '#c7c3f5', '#cecbf6', '#d5d2f7'],
    ['#bfcf8f', '#c5d39a', '#cbd8a5', '#d2ddb0', '#d8e2bb'],
    ['#a4beea', '#adc4ec', '#b6cbee', '#bfd1f0', '#c8d8f2'],
    ['#e9d6a2', '#ebdaab', '#eddeb4', '#efe2bd', '#f1e6c7'],
    ['#7cc7c5', '#89ccca', '#96d2d0', '#a3d7d6', '#b0dddc'],
    ['#e9b0b5', '#ebb7bc', '#edbfc3', '#efc7cb', '#f1cfd2'],
    ['#a2ece7', '#abede9', '#b4efeb', '#bdf1ee', '#c7f3f0'],
    ['#aebc97', '#b6c2a1', '#bec9ab', '#c6d0b6', '#ced6c0'],
    ['#c8e6be', '#cde8c4', '#d3ebcb', '#d8edd1', '#def0d8']
  ];

  var colorKeys = [0, 1, 2, 3, 4]; // dark to light
  var selfColorIndex = 0;
  var maxAllowFriends = 15;

  var hashCode = function(s) {
    return s.split('').reduce(function(a, b) {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
  };

  var assignColors = []; // assign colors in order

  this.getColorMatrix = function(s) {
    var n = selfColorIndex;
    if (s !== undefined) {
      if (!assignColors.includes(s)) {
        assignColors.push(s);
      }
      n = assignColors.indexOf(s) % maxAllowFriends + 1;
    }

    var result = [];
    colorKeys.forEach(function(i) {
      result.push(colors[n][i]);
    });

    return result;
  };
});
