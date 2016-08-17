angular.module('connectrFrontendApp').directive('mapboxGlMap', function(){
    return {
        scope: true,
        replace: true,
        template: '<div id="map" ng-click="randomFly()"></div>',
        link: function($scope) {
            mapboxgl.accessToken = "pk.eyJ1IjoibnVsbDA5MjY0IiwiYSI6ImNpcnlrcTZmYzAwMGYyeXBkaGF1c2JxZ2EifQ.pEmdeamPVAasYgavpT629g";

            $scope.map = new mapboxgl.Map({
                container: 'map',
                style: 'mapbox://styles/mapbox/dark-v9',
                // style: 'mapbox://styles/mapbox/light-v9',
                // style: 'mapbox://styles/mapbox/streets-v9',
                // style: 'mapbox://styles/mapbox/outdoors-v9',
                center: [103.8198, 1.3521],
                zoom: 13.5,
                pitch: 60,
                interactive: true,
                attributionControl: false
            });

            // $scope.map.addControl(new mapboxgl.Navigation({position: 'bottom-right'}));
            // $scope.map.addControl(new mapboxgl.Geolocate({position: 'bottom-right'}));

            $scope.randomFly = function() {
                $scope.map.flyTo({
                    center: [
                        103.8198 + (Math.random() - 0.5) * 0.1,
                        1.3521 + (Math.random() - 0.5) * 0.1]
                });
            }
        }
    };
});
