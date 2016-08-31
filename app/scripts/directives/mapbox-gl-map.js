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
            // disable box zoom
            $scope.map.boxZoom.disable();

            var controls = [
                new mapboxgl.Navigation({position: 'bottom-right'}), 
                new mapboxgl.Geocoder({position: 'top-right'})
            ];
            
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
                var layers = [50, 20, 10, 0];
                layers.forEach(function (layer, i) {
                    $scope.map.removeLayer(name + "-cluster-" + i);
                    $scope.map.removeLayer(name + "-cluster-shadow-" + i);
                    remove($scope.mapAnnotationLayers, name + "-cluster-shadow-" + i);
                });
                remove($scope.displayedFriendIDs, name)
            }

            $scope.addPointsFromGeojson = function(name, data, colors) {

                var mainOpacity = 0.75
                var shadowOpacity = 0.65

                $scope.map.addSource(name, {
                    type: "geojson",
                    data: data,
                    cluster: true,
                    clusterMaxZoom: 14,
                    clusterRadius: 50
                });

                $scope.map.addLayer({
                    "id": name + "-unclustered-points-shadow",
                    "type": "circle",
                    "source": name,
                    "paint": {
                        "circle-color": "#ffffff",
                        "circle-radius": 13,
                        "circle-opacity": shadowOpacity
                    }
                });

                $scope.map.addLayer({
                    "id": name + "-unclustered-points",
                    "type": "circle",
                    "source": name,
                    "paint": {
                        "circle-color": colors[4],
                        "circle-radius": 10,
                        "circle-opacity": mainOpacity
                    }
                });

                $scope.mapAnnotationLayers.push(name + "-unclustered-points-shadow")

                var layers = [
                    [50, colors[0], 32, 36],
                    [20, colors[1], 26, 30],
                    [10, colors[2], 20, 24],
                    [0, colors[3], 16, 20]
                ];

                layers.forEach(function (layer, i) {
                    $scope.map.addLayer({
                        "id": name + "-cluster-shadow-" + i,
                        "type": "circle",
                        "source": name,
                        "paint": {
                            "circle-color": "#ffffff",
                            "circle-radius": layer[3],
                            "circle-opacity": shadowOpacity
                        },
                        "filter": i === 0 ?
                            [">=", "point_count", layer[0]] :
                            ["all",
                                [">=", "point_count", layer[0]],
                                ["<", "point_count", layers[i - 1][0]]]
                    });

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

            $scope.map.on('click', function (e) {
                var features = $scope.map.queryRenderedFeatures(e.point, { 
                    layers: $scope.mapAnnotationLayers 
                });

                if (!features.length) {
                    return;
                }

                var feature = features[0];
                var placeFacebookID = feature.properties["place_fb_id"]
                if (placeFacebookID) {
                    var url = "https://www.facebook.com/" + placeFacebookID
                    window.open(url,'_blank');
                } else {
                    console.log(feature)
                    var zoomMap = [3, 4, 5, 6];
                    var level = zoomMap[parseInt(feature.layer.id.split("-").pop())]
                    var coordinate = feature.geometry.coordinates
                    if (!level) {
                        level = $scope.map.getZoom()
                    }
                    $scope.map.flyTo({
                        center: coordinate,
                        zoom: level
                    })
                }
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

                popup.setLngLat(e.lngLat)
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

                // var addressLine = feature.properties["place_name"]

                // if (addressLine === undefined) {
                //     addressLine = feature.properties.point_count + " places"
                // }

                // var html = addressLine

                // if (friend) {
                //     html += ("<br>" + friend.name)
                // }

                // cachedFeature = feature
                // cachedHTML = html

                var timeString = feature.properties["checkin_time"]
                if (timeString) {
                    var date = new Date(timeString).toLocaleDateString('en-GB', {  
                        day : 'numeric',
                        month : 'short',
                        year : 'numeric'
                    }).split(' ')

                    timeString = date[1] + " " + date[0] + ", " + date[2]
                }

                var html = htmlTemplate(friend.avatar, friend.name, friend.primaryColor, feature.properties.point_count, feature.properties["place_name"], timeString)

                return html
            }

            function htmlTemplate(imageURL, name, primaryColor, placeCount, placeName, time) {
                var html =
                "<div class='popup'>" +
                    "<div class='avatar' style=\"background-image: url('" + imageURL + "')\">" +
                    "</div>" +
                    "<div class='info'>" +
                        "<div class='name' style='color: "+ primaryColor +"'>" +
                            name +
                        "</div>" +
                        "<div class='place'>" +
                            (!time ? "" :  time + ". ") +  
                            (placeCount ? placeCount + " places" : placeName) +
                        "</div>" +
                    "</div>" +
                "</div>"

                return html
            }

            function findPerson(id) {
                if (id === session.currentUser.id) {
                    return session.currentUser
                }

                return session.friends[id];
            }

            $scope.map.on('load', function(e) {
                if ($scope.checkInSources.length != 0) {
                    for (var i = 0; i < $scope.checkInSources.length; i++) {
                        var entry = $scope.checkInSources[i]
                        loadCheckinData(entry[0], entry[1])
                    }
                }
            })

            $scope.$on("api.selfCheckinsLoaded", function (event) {
                if ($scope.map.loaded()) {
                    loadCheckinData(session.currentUser.id, session.currentUser.checkins)
                } else {
                    $scope.checkInSources.push([session.currentUser.id, session.currentUser.checkins])
                }
            })

            function loadCheckinData(source, data) {
                $scope.addPointsFromGeojson(source, data, colorPicker.getColorMatrix())
            }

            $scope.displayedFriendIDs = []

            $scope.$on("map.needsAddCheckinsForFriend", function(event, friend) {
                if (!$scope.displayedFriendIDs.includes(friend.id)) {
                    $scope.displayedFriendIDs.push(friend.id)
                    var colors = friend.id === session.currentUser.id ? colorPicker.getColorMatrix() : colorPicker.getColorMatrix(friend.id)
                    friend.primaryColor = colors[0]
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
