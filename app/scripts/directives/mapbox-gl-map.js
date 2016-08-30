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
                // style: 'mapbox://styles/mapbox/dark-v9',
                style: 'mapbox://styles/mapbox/light-v9',
                // style: 'mapbox://styles/mapbox/streets-v9',
                // style: 'mapbox://styles/mapbox/outdoors-v9',
                center: [103.8198, 1.3521],
                zoom: 0,
                // pitch: 60,
                interactive: true,
                attributionControl: false,
                preserveDrawingBuffer: true
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

            function remove(arr, item) {
                for(var i = arr.length; i--;) {
                    if(arr[i] === item) {
                        arr.splice(i, 1);
                    }
                }
            }

            $scope.removeSourceFromMap = function(name) {
                var map = $scope.map
                map.removeSource(name)
                map.removeLayer(name + "-unclustered-points")
                map.removeLayer(name + "-unclustered-points-shadow")
                remove($scope.mapAnnotationLayers, name + "-unclustered-points-shadow")
                var layers = [500, 150, 20, 0];
                layers.forEach(function (layer, i) {
                    $scope.map.removeLayer(name + "-cluster-" + i);
                    $scope.map.removeLayer(name + "-cluster-shadow-" + i);
                    remove($scope.mapAnnotationLayers, name + "-cluster-shadow-" + i);
                });
                remove($scope.displayedFriendIDs, name)
            }

            $scope.addPointsFromGeojson = function(name, data, colors) {

                var mainOpacity = 0.5
                var shadowOpacity = 0.5

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
                    [50, colors[3], 35],
                    [20, colors[2], 30],
                    [10, colors[1], 25],
                    [0, colors[0], 20]
                ];

                layers.forEach(function (layer, i) {
                    $scope.map.addLayer({
                        "id": name + "-cluster-" + i,
                        "type": "circle",
                        "source": name,
                        "paint": {
                            "circle-color": layer[1],
                            "circle-radius": layer[2],
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
                            "circle-radius": layer[2] * 1.3,
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
                // anchor: 'bottom-left',
                offset: [0, -15]
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
                var html = htmlForFeature(feature)

                var lngLat = e.lngLat
                if (lngLat.lat < 89.95) {
                    lngLat.lat += 0.05
                }

                popup.setLngLat(lngLat)
                    .setHTML(html)
                    .addTo(map);
            });

            var cachedFeature
            var cachedHTML

            function htmlForFeature(feature) {
                if (feature === cachedFeature) {
                    return cachedHTML
                }

                var userID = feature.layer.source
                var friend = findPerson(userID)

                var addressLine = feature.properties["place_name"]

                if (addressLine === undefined) {
                    addressLine = feature.properties.point_count + " places"
                }

                var html = addressLine

                if (friend) {
                    html += ("<br>" + friend.name)
                }

                cachedFeature = feature
                cachedHTML = html

                return html
            }

            function findPerson(id) {
                var result = session.friends[id];
                //TODO: need to compare to current user
                return result
            }

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
                    $scope.checkInSources.push(["My Checkins", data])
                }
            })

            function loadCheckinData(source, data) {
                $scope.addPointsFromGeojson(source, data, colorPicker.getColorMatrix())
            }

            $scope.displayedFriendIDs = []

            $scope.$on("map.needsAddCheckinsForFriend", function(event, friend) {
                if (!$scope.displayedFriendIDs.includes(friend.id)) {
                    $scope.displayedFriendIDs.push(friend.id)
                    var colors = colorPicker.getColorMatrix(friend.id)
                    friend.primaryColor = colors[colors.length - 1]
                    friend.toggle = "glyphicon glyphicon-eye-open"
                    $scope.addPointsFromGeojson(friend.id, friend.checkins, colors)
                }
            })

            $scope.$on("map.needsRemoveCheckinsForFriend", function(event, friend) {
                if ($scope.displayedFriendIDs.includes(friend.id)) {
                    $scope.removeSourceFromMap(friend.id)
                    friend.primaryColor = "#ffffff"
                    friend.toggle = "glyphicon glyphicon-eye-close"
                }
            })
        }
    };
});
