'use strict';

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

            $scope.addPointsFromGeojson = function(name, data, colors) {
                $scope.map.addSource(name, {
                    type: "geojson",
                    data: data,
                    cluster: true,
                    clusterMaxZoom: 14,
                    clusterRadius: 50
                });

                $scope.map.addLayer({
                    "id": name + "-unclustered-points",
                    "type": "circle",
                    "source": name,
                    "paint": {
                        "circle-color": colors[3],
                        "circle-radius": 5,
                        "circle-opacity": 0.9
                    }
                });

                $scope.map.addLayer({
                    "id": name + "-unclustered-points-shadow",
                    "type": "circle",
                    "source": name,
                    "paint": {
                        "circle-color": "#ffffff",
                        "circle-radius": 7,
                        "circle-opacity": 0.3
                    }
                });

                var layers = [
                    [500, colors[0]],
                    [150, colors[1]],
                    [20, colors[2]],
                    [0, colors[3]]
                ];

                layers.forEach(function (layer, i) {
                    $scope.map.addLayer({
                        "id": name + "-cluster-" + i,
                        "type": "circle",
                        "source": name,
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

                    $scope.map.addLayer({
                        "id": name + "-cluster-shadow-" + i,
                        "type": "circle",
                        "source": name,
                        "paint": {
                            "circle-color": layer[1],
                            "circle-radius": 13,
                            "circle-opacity": 0.3
                        },
                        "filter": i === 0 ?
                            [">=", "point_count", layer[0]] :
                            ["all",
                                [">=", "point_count", layer[0]],
                                ["<", "point_count", layers[i - 1][0]]]
                    });
                });

                $scope.map.addLayer({
                    "id": name + "-cluster-count",
                    "type": "symbol",
                    "source": name,
                    "layout": {
                        "text-field": "{point_count}",
                        "text-font": [
                            "DIN Offc Pro Medium",
                            "Arial Unicode MS Bold"
                        ],
                        "text-size": 8,
                    }
                });
            }

            $scope.map.on('load', function(e) {
                //faked data points
                $scope.addPointsFromGeojson("earthquakes1", "../../fake-data/earthquakes1.geojson", ['#78909c','#90a4ae','#b0bec5','#cfd8dc'])
                $scope.addPointsFromGeojson("earthquakes2", "../../fake-data/earthquakes2.geojson", ['#ffca28','#ffd54f','#ffe082','#ffecb3'])
            })
        }
    };
});
