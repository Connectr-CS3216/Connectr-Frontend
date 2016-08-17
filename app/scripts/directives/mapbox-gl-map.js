angular.module('connectrFrontendApp').directive('mapboxGlMap', function(){
    return {
        scope: true,
        replace: true,
        template: '<div id="map"></div>',
        link: function($scope) {
            mapboxgl.accessToken = "pk.eyJ1IjoibnVsbDA5MjY0IiwiYSI6ImNpcnlrcTZmYzAwMGYyeXBkaGF1c2JxZ2EifQ.pEmdeamPVAasYgavpT629g";

            $scope.map = new mapboxgl.Map({
                container: 'map',
                style: 'mapbox://styles/mapbox/dark-v9',
                // style: 'mapbox://styles/mapbox/light-v9',
                // style: 'mapbox://styles/mapbox/streets-v9',
                // style: 'mapbox://styles/mapbox/outdoors-v9',
                center: [103.8198, 1.3521],
                zoom: 0,
                // pitch: 60,
                interactive: true,
                attributionControl: false
            });

            $scope.map.addControl(new mapboxgl.Navigation({position: 'bottom-right'}));
            $scope.map.addControl(new mapboxgl.Geolocate({position: 'bottom-right'}));

            $scope.randomFly = function(long, lat) {
                $scope.map.flyTo({
                    center: [long, lat]
                });
            }

            $scope.map.on('click', function (e) {
                var point = e.lngLat;
                // $scope.randomFly(point["lng"], point["lat"])
            });

            $scope.map.on('load', function(e) {
                //faked data points
                $scope.map.addSource("earthquakes", {
                    type: "geojson",
                    data: "../../fake-data/earthquakes.geojson",
                    cluster: true,
                    clusterMaxZoom: 14,
                    clusterRadius: 50
                });

                $scope.map.addLayer({
                    "id": "unclustered-points",
                    "type": "symbol",
                    "source": "earthquakes",
                    "layout": {
                        "icon-image": "marker-15"
                    }
                });

                var layers = [
                    [500, '#78909c'],
                    [150, '#90a4ae'],
                    [20, '#b0bec5'],
                    [0, '#cfd8dc']
                ];

                layers.forEach(function (layer, i) {
                    $scope.map.addLayer({
                        "id": "cluster-" + i,
                        "type": "circle",
                        "source": "earthquakes",
                        "paint": {
                            "circle-color": layer[1],
                            "circle-radius": 10,
                            "circle-opacity": 0.9
                        },
                        "filter": i === 0 ?
                            [">=", "point_count", layer[0]] :
                            ["all",
                                [">=", "point_count", layer[0]],
                                ["<", "point_count", layers[i - 1][0]]]
                    });
                });

                $scope.map.addLayer({
                    "id": "cluster-count",
                    "type": "symbol",
                    "source": "earthquakes",
                    "layout": {
                        "text-field": "{point_count}",
                        "text-font": [
                            "DIN Offc Pro Medium",
                            "Arial Unicode MS Bold"
                        ],
                        "text-size": 8,
                    }
                });
            })
        }
    };
});
