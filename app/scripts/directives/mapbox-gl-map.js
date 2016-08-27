'use strict';

angular.module('connectrFrontendApp').directive('mapboxGlMap', function(session, apis, colorPicker){
    return {
        scope: true,
        replace: true,
        template: '<div id="map"></div>',
        link: function($scope) {
            mapboxgl.accessToken = "pk.eyJ1IjoibnVsbDA5MjY0IiwiYSI6ImNpcnlrcTZmYzAwMGYyeXBkaGF1c2JxZ2EifQ.pEmdeamPVAasYgavpT629g";
            $scope.checkInSources = []
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


            var controls = [new mapboxgl.Navigation({position: 'bottom-right'})];
            controls.forEach(function(c) {
                c.addTo($scope.map)
            })

            $scope.$on("map.needsRemoveControl", function(event) {
                controls.forEach(function(c) {
                    c.remove()
                })
            })

            $scope.$on("map.needsDisplayControl", function(event) {
                controls.forEach(function(c) {
                    c.addTo($scope.map)
                })
            })


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

                var mainOpacity = 0.2
                var shadowOpacity = 0.2

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
                        "circle-radius": 10,
                        "circle-opacity": mainOpacity
                    }
                });


                $scope.map.addLayer({
                    "id": name + "-unclustered-points-shadow",
                    "type": "circle",
                    "source": name,
                    "paint": {
                        "circle-color": "#ffffff",
                        "circle-radius": 14,
                        "circle-opacity": shadowOpacity
                    }
                });

                $scope.mapAnnotationLayers.push(name + "-unclustered-points-shadow")

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
                            "circle-radius": 20,
                            "circle-opacity": mainOpacity
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
                            "circle-radius": 26,
                            "circle-opacity": shadowOpacity
                        },
                        "filter": i === 0 ?
                            [">=", "point_count", layer[0]] :
                            ["all",
                                [">=", "point_count", layer[0]],
                                ["<", "point_count", layers[i - 1][0]]]
                    });

                    $scope.mapAnnotationLayers.push(name + "-cluster-shadow-" + i)
                });

                // $scope.map.addLayer({
                //     "id": name + "-cluster-count",
                //     "type": "symbol",
                //     "source": name,
                //     "layout": {
                //         "text-field": "{point_count}",
                //         "text-font": [
                //             "DIN Offc Pro Medium",
                //             "Arial Unicode MS Bold"
                //         ],
                //         "text-size": 12,
                //     }
                // });
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

                
                html = feature.properties["place_name"]
                if (html === undefined) {
                    var count = feature.properties.point_count
                    html = count + " places<br>" + "source: " + feature.layer.source
                }

                // Populate the popup and set its coordinates
                // based on the feature found.
                popup.setLngLat(e.lngLat)
                    .setHTML(html)
                    .addTo(map);
            });

            $scope.map.on('load', function(e) {
                if ($scope.checkInSources.length != 0) {
                    for (var i = 0; i < $scope.checkInSources.length; i++) {
                        var entry = $scope.checkInSources[i]
                        loadCheckinData(entry[0], entry[1])
                    }
                }
            })

            $scope.$on("api.selfCheckinsLoaded", function (event, data) {
                if ($scope.map.loaded()) {
                    loadCheckinData("My Checkins", data)
                } else {
                    $scope.checkInSources.push(["My checkins", data])
                }
            })

            function loadCheckinData(source, data) {
                $scope.addPointsFromGeojson(source, data, colorPicker.getColorMatrix())
            }

            $scope.displayedFriendIDs = []

            $scope.$on("map.needsAddCheckinsForFriend", function(event, friend) {
                console.log(friend)
                if (!$scope.displayedFriendIDs.includes(friend.id)) {
                    var index = $scope.displayedFriendIDs.length
                    $scope.displayedFriendIDs.push(friend.id)
                    var colors = colorPicker.getColorMatrix(index)
                    $scope.addPointsFromGeojson(friend.id, friend.checkins, colors)
                }
            })
        }
    };
});
