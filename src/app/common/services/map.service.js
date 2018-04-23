/**
 * Created by Otherplayer on 2016/12/12.
 */

(function () {
    'use strict';


    /**
     *
     * facotry是一个单例,它返回一个包含service成员的对象。
     * 注：所有的Angular services都是单例，这意味着每个injector都只有一个实例化的service。
     *
     */
    angular
        .module('smart_container')
        .factory('MapService', MapService);

    /** @ngInject */
    function MapService(constdata,NetworkService,$q, StorageService,iotUtil,$timeout,$state,toastr) {


        var service = {
          map_init: map_init,
          addMarker: addMarker,
          addCircle: addCircle,
          direction: direction,
          geoCodePosition: geoCodePosition
        };

        var mapIcons = {
            'container': "images/icon_box_blue.svg",
            'satellite': "images/satellite3.svg",
            'warehouse': "images/icon_warehouse.svg",
            'redBox': "images/icon_box_red.svg",
            'transparent':"images/transparent1x1.png"
        };

        return service;

        ////////////信息

        function map_init(id, center, mapType, zoomLevel) {
            var bounds2 = new google.maps.LatLngBounds(
                 new google.maps.LatLng(-45.751704, -101.762375),
                 new google.maps.LatLng(45.042108, 234.981746)
            );
            var bounds3 = new google.maps.LatLngBounds(
                 new google.maps.LatLng(-50.751704, -101.762375),
                 new google.maps.LatLng(72.042108, 234.981746)
            );
            var bounds4 = new google.maps.LatLngBounds(
                 new google.maps.LatLng(-70.751704, -101.762375),
                 new google.maps.LatLng(77.042108, 234.981746)
            );
            var bounds8 = new google.maps.LatLngBounds(
                 new google.maps.LatLng(-80.751704, -101.762375),
                 new google.maps.LatLng(80.042108, 234.981746)
            );

            var bounds = [
              bounds2,    // 0
              bounds2,
              bounds2,    // 2
              bounds3,
              bounds4,
              bounds8,
              bounds8,
              bounds8,
              bounds8,     // 8
              bounds8,
              bounds8,
              bounds8,
              bounds8,
              bounds8,
              bounds8,
              bounds8,
              bounds8,
              bounds8
            ]
            // Create a map object and specify the DOM element for display.
            var map = new google.maps.Map(document.getElementById(id), {
                center: center,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                //mapTypeControl:false,
                //panControl:false,
                //streetViewControl: false,
                //overviewMapControl:false,
                //scaleControl: false,
                //scrollwheel: false,
                disableDefaultUI:true,
                maxZoom: 17,
                minZoom: 2,
                zoom: zoomLevel || 3
            });

            // bounds of the desired area
            var allowedBounds = bounds[Math.ceil(zoomLevel)];

            var lastValidCenter = map.getCenter();

            google.maps.event.addListener(map, 'center_changed', function() {
                if (allowedBounds && allowedBounds.contains(map.getCenter())) {
                    // still within valid bounds, so save the last valid position
                    lastValidCenter = map.getCenter();
                    return;
                }

                // not valid anymore => return to last valid position
                map.panTo(lastValidCenter);
            });

            google.maps.event.addListener(map, 'zoom_changed', function() {
                var level = map.getZoom();

                allowedBounds = bounds[level];
            });

            return map
        }

        // 编写自定义函数,创建标注
        function addMarker(map, type){
            return function (position,opt) {
                var adjusted_position = undefined;

                //如果当前坐标是google则不需要转换 请设置opt的notTranslate为True
                if(opt && opt.notTranslate){
                    adjusted_position = position;
                }else{
                    adjusted_position = position_adjustment(position)
                }

                var marker = new google.maps.Marker({
                    map: map,
                    draggable: opt ? opt.draggable || false : false,
                    position: adjusted_position,
                    icon: mapIcons[type],
                });
                return marker
            }
        }

        function addCircle(map) {
            return function (position) {
                var circle = new google.maps.Circle({
                    strokeColor: 'white',
                    strokeOpacity: 0.5,
                    strokeWeight: .5,
                    fillColor: 'red',
                    fillOpacity: 0.2,
                    map: map,
                    center: position,
                    radius: 1000000
                });
            }
        }

        function direction(startPointLatlng, endPointLatlng) {
          var directionsDisplay = new google.maps.DirectionsRenderer();
          var directionsService = new google.maps.DirectionsService();

          directionsDisplay.setMap(map);

          var request = {
            origin: startPointLatlng,
            destination: endPointLatlng,
            travelMode: 'DRIVING'
          };


          directionsService.route(request, function(result, status) {
            if (status == 'OK') {
              directionsDisplay.setDirections(result);
            }
          });


        }

        function geoCodePosition(position) {
            return $q(function(resolve, reject) {
                var geocoder = new google.maps.Geocoder;

                geocoder.geocode({"location": position}, function(results, status){
                    if(status == google.maps.GeocoderStatus.OK) {
                        resolve(results)
                    } else {
                        reject(status)
                    }
                })
            })
        }

        function position_adjustment(position) {
            var lat = position.lat;
            var lng = position.lng;
            var newPosition = [];

            var adjusted_position = {}

            lat = do_convert(lat);
            lng = do_convert(lng);

            // https://github.com/wandergis/coordtransform/blob/master/index.js
            newPosition = coordtransform.wgs84togcj02(lng, lat)
            adjusted_position.lng = newPosition[0]
            adjusted_position.lat = newPosition[1]

            return adjusted_position
        }

        function do_convert(value) {
            var int_value = Math.floor(value);
            var decimal_value = value - int_value;
            var retVal = undefined;
            retVal = ( decimal_value * 100 / 60 ) + int_value;
            return retVal;
        }
    }
})();
