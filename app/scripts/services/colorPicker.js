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

    // var colors =   [["#FFFDE7","#FFF9C4","#FFF59D","#FFF176","#FFEE58","#FFEB3B","#FDD835","#FBC02D","#F9A825","#F57F17"],
    //                 ["#FFEBEE","#FFCDD2","#EF9A9A","#E57373","#EF5350","#F44336","#E53935","#D32F2F","#C62828","#B71C1C"],
    //                 ["#FCE4EC","#F8BBD0","#F48FB1","#F06292","#EC407A","#E91E63","#D81B60","#C2185B","#AD1457","#880E4F"],
    //                 ["#F3E5F5","#E1BEE7","#CE93D8","#BA68C8","#AB47BC","#9C27B0","#8E24AA","#7B1FA2","#6A1B9A","#4A148C"],
    //                 ["#EDE7F6","#D1C4E9","#B39DDB","#9575CD","#7E57C2","#673AB7","#5E35B1","#512DA8","#4527A0","#311B92"],
    //                 ["#E8EAF6","#C5CAE9","#9FA8DA","#7986CB","#5C6BC0","#3F51B5","#3949AB","#303F9F","#283593","#1A237E"],
    //                 ["#E3F2FD","#BBDEFB","#90CAF9","#64B5F6","#42A5F5","#2196F3","#1E88E5","#1976D2","#1565C0","#0D47A1"],
    //                 ["#E1F5FE","#B3E5FC","#81D4FA","#4FC3F7","#29B6F6","#03A9F4","#039BE5","#0288D1","#0277BD","#01579B"],
    //                 ["#E0F7FA","#B2EBF2","#80DEEA","#4DD0E1","#26C6DA","#00BCD4","#00ACC1","#0097A7","#00838F","#006064"],
    //                 ["#E0F2F1","#B2DFDB","#80CBC4","#4DB6AC","#26A69A","#009688","#00897B","#00796B","#00695C","#004D40"],
    //                 ["#E8F5E9","#C8E6C9","#A5D6A7","#81C784","#66BB6A","#4CAF50","#43A047","#388E3C","#2E7D32","#1B5E20"],
    //                 ["#F1F8E9","#DCEDC8","#C5E1A5","#AED581","#9CCC65","#8BC34A","#7CB342","#689F38","#558B2F","#33691E"],
    //                 ["#F9FBE7","#F0F4C3","#E6EE9C","#DCE775","#D4E157","#CDDC39","#C0CA33","#AFB42B","#9E9D24","#827717"],
    //                 ["#FFF8E1","#FFECB3","#FFE082","#FFD54F","#FFCA28","#FFC107","#FFB300","#FFA000","#FF8F00","#FF6F00"],
    //                 ["#FFF3E0","#FFE0B2","#FFCC80","#FFB74D","#FFA726","#FF9800","#FB8C00","#F57C00","#EF6C00","#E65100"],
    //                 ["#FBE9E7","#FFCCBC","#FFAB91","#FF8A65","#FF7043","#FF5722","#F4511E","#E64A19","#D84315","#BF360C"],
    //                 ["#EFEBE9","#D7CCC8","#BCAAA4","#A1887F","#8D6E63","#795548","#6D4C41","#5D4037","#4E342E","#3E2723"],
    //                 ["#FAFAFA","#F5F5F5","#EEEEEE","#E0E0E0","#BDBDBD","#9E9E9E","#757575","#616161","#424242","#212121"],
    //                 ["#ECEFF1","#CFD8DC","#B0BEC5","#90A4AE","#78909C","#607D8B","#546E7A","#455A64","#37474F","#263238"]];

    // http://tools.medialab.sciences-po.fr/iwanthue/ -> palette
    // http://www.color-hex.com/color/3e5468 -> gradient
    var colors =   [['#3e5468','#516577','#647686','#778795','#8b98a4'],
                    ['#e8b293','#eab99d','#ecc1a8','#eec9b3','#f1d0be'],
                    ['#6eceea','#7cd2ec','#8bd7ee','#99dcf0','#a8e1f2'],
                    ['#eda4c1','#eeadc7','#f0b6cd','#f2bfd3','#f4c8d9'],
                    ['#79ddcb','#86e0d0','#93e3d5','#a1e7da','#aeeadf'],
                    ['#dfb3e2','#e2bae4','#e5c2e7','#e8c9ea','#ebd1ed'],
                    ['#96d8ab','#a0dbb3','#abdfbb','#b5e3c4','#c0e7cc'],
                    ['#b9b5f3','#c0bcf4','#c7c3f5','#cecbf6','#d5d2f7'],
                    ['#bfcf8f','#c5d39a','#cbd8a5','#d2ddb0','#d8e2bb'],
                    ['#a4beea','#adc4ec','#b6cbee','#bfd1f0','#c8d8f2'],
                    ['#e9d6a2','#ebdaab','#eddeb4','#efe2bd','#f1e6c7'],
                    ['#7cc7c5','#89ccca','#96d2d0','#a3d7d6','#b0dddc'],
                    ['#e9b0b5','#ebb7bc','#edbfc3','#efc7cb','#f1cfd2'],
                    ['#a2ece7','#abede9','#b4efeb','#bdf1ee','#c7f3f0'],
                    ['#aebc97','#b6c2a1','#bec9ab','#c6d0b6','#ced6c0'],
                    ['#c8e6be','#cde8c4','#d3ebcb','#d8edd1','#def0d8']];

    var colorKeys = [0, 1, 2, 3, 4] // dark to light
    var selfColorIndex = 0
    var maxAllowFriends = 15

    var hashCode = function(s) {
        return s.split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);
    }

    var assignColors = []; // assign colors in order

    this.getColorMatrix = function(s) {
        var n = selfColorIndex
        if (s !== undefined) {
            if (!assignColors.includes(s)) {
                assignColors.push(s)
            }
            n = assignColors.indexOf(s) % maxAllowFriends + 1
            // n = hashCode(s) % maxAllowFriends
            // if (n < 0) {
            //     n += maxAllowFriends
            // }
        }

        var result = []
        colorKeys.forEach(function(i) {
            result.push(colors[n][i])
        })

        return result
    }
});