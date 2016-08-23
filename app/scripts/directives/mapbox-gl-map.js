'use strict';

angular.module('connectrFrontendApp').directive('mapboxGlMap', function(session, apis){
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

            session.map = $scope.map
            // disable map rotation
            $scope.map.dragRotate.disable();
            $scope.map.touchZoomRotate.disableRotation();

            $scope.map.addControl(new mapboxgl.Navigation({position: 'bottom-right'}));

            $scope.randomFly = function(long, lat) {
                $scope.map.flyTo({
                    center: [long, lat]
                });
            }

            $scope.map.on('click', function (e) {
                var point = e.lngLat;
                // $scope.randomFly(point["lng"], point["lat"])
            });

            $scope.mapAnnotationLayers = []

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

                $scope.mapAnnotationLayers.push(name + "-unclustered-points")

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

                    $scope.mapAnnotationLayers.push(name + "-cluster-" + i)

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

            

            var popup = new mapboxgl.Popup({
                closeButton: false,
                closeOnClick: false,
                continuousWorld: true
            });

            $scope.map.on('mousemove', function(e) {
                var map = $scope.map

                var features = map.queryRenderedFeatures(e.point, {
                    layers: $scope.mapAnnotationLayers
                });

                // Change the cursor style as a UI indicator.
                map.getCanvas().style.cursor = (features.length) ? 'pointer' : '';

                if (!features.length) {
                    popup.remove();
                    return;
                }

                var feature = features[0];

                var html = feature.properties["Secondary ID"]
                if (html === undefined) {
                    html = feature.properties["place_name"]
                    if (html === undefined) {
                        var count = feature.properties.point_count
                        html = count + " places<br>" + "source: " + feature.layer.source
                    }
                }

                // Populate the popup and set its coordinates
                // based on the feature found.
                popup.setLngLat(e.lngLat)
                    .setHTML(html)
                    .addTo(map);
            });

            apis.checkins.get({
              'token': "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbiI6IkVBQUlaQlNuN2RJeUFCQUl2YzV3Nk1yVTBTMmFNN1dwdHVaQkExSXM5WkNVV0xjWkI1ZmliZWVwMThEOGl3RHNlcERieGhseXRnUmlWazJFZGRjcDlQUlVnSjVvb2FncURyWkFXa3JOVmY2WXU1djYxcTRoUFR1M2p2U3RoYkJYVjVaQ1FWNVpDb1lmZ1hIRUh6WkM5UE0xd2lLTkl3bExmUk1ZOWNNWWhNUzZOamdaRFpEIiwidXNlcmlkIjoiM2Q4ZDI5MjAtODVhOS00YWMxLTlkZjItZDZiZTAzM2I0NjM5IiwiaXNzIjoiaHR0cDpcL1wvY29ubmVjdHIudGtcL3ZlcmlmeS1mYWNlYm9vay10b2tlbiIsImlhdCI6MTQ3MTk3MDUwOSwiZXhwIjoxNDcxOTc0MTA5LCJuYmYiOjE0NzE5NzA1MDksImp0aSI6IjkwMDU4ZTRhNDYzOWRkZmQyMTVjYTQzYzBhYzA0NDM3In0.KXqkJPh-6PSqbsiJvwl5ozrC1IxtMVhr12aThC5ViBs",
              'format': 'geojson'
            }).success(function(data) {
                session.checkins = data
                $scope.checkInDataIsReady = true

                if ($scope.map.loaded()) {
                    loadCheckinDataForSelf()
                }

                console.log(data)
            });

            $scope.map.on('load', function(e) {
                //faked data points
                $scope.addPointsFromGeojson("earthquakes-dataset-2", "../../fake-data/earthquakes2.geojson", ['#ffca28','#ffd54f','#ffe082','#ffecb3'])
                if ($scope.checkInDataIsReady) {
                    loadCheckinDataForSelf()
                }
            })

            function loadCheckinDataForSelf() {
                 $scope.addPointsFromGeojson("self-checkins", session.checkins, ['#78909c','#90a4ae','#b0bec5','#cfd8dc'])    
            }
        }
    };
});
