angular.module('connectrFrontendApp').directive('mapboxGlMap', function(){
    return {
        scope: true,
        replace: true,
        template: '<div id="map"></div>',
        link: function($scope) {
            mapboxgl.accessToken = "pk.eyJ1IjoibnVsbDA5MjY0IiwiYSI6ImNpcnlrcTZmYzAwMGYyeXBkaGF1c2JxZ2EifQ.pEmdeamPVAasYgavpT629g";

            $scope.map = new mapboxgl.Map({
                container: 'map', // container id
                style: 'mapbox://styles/mapbox/dark-v9', //stylesheet location
                center: [103.8198, 1.3521], // starting position
                zoom: 11, // starting zoom,
                interactive: true
            });
        }
    };
});
