/**
 * Created by Otherplayer on 16/7/21.
 */
(function () {
    'use strict';

    angular.module('smart_container').controller('ContainerOverviewController', ContainerOverviewController);

    /** @ngInject */
    function ContainerOverviewController($stateParams, constdata, ApiServer, MapService, toastr, $state, $timeout, $interval, $scope) {
        /* jshint validthis: true */
        var vm = this;

        var width = document.body.clientWidth;
        var height = document.body.clientHeight;
        var histories = [];
        var routes = [];
        vm.mapSize = {"width": width + 'px', "height": height + 'px'};
        var mapCenter = {lat: 31.2891, lng: 121.4648};

        var map = MapService.map_init("containeroverview", mapCenter, "terrain", 4);
        var heatmap = undefined;

        vm.getHistorylocationInfo = getHistorylocationInfo;

        vm.getOperationOverview = getOperationOverview;

        vm.queryParams = {
            containerId: $stateParams.containerId || constdata.defaultContainerId,
            start_time: moment(new Date()),
            end_time: moment(new Date())
        };

        $scope.validationCheck = function () {
            $scope.isContainerIdInvalida = vm.queryParams.containerId != "" && !constdata['validation']['id'].test(vm.queryParams.containerId);
        };

        // 鼠标绘图工具
        $scope.container_num = undefined;
    
        getHistorylocationInfo();
        //getOperationOverview();


        function getHistorylocationInfo() {
            ApiServer.getContainerOverviewInfo(function (response) {
               
                console.log("res = ", response);
                var histData = R.map(function (item) {
                    var lng = parseFloat(item.lng);
                    var lat = parseFloat(item.lat);

                    var res = {
                        location: new google.maps.LatLng(lat, lng),
                        weight: item.cnt
                    };
                    return res;
                })(response.data.data);
                $scope.container_num = response.data.container_num;
          
                var bounds = new google.maps.LatLngBounds();
                if (R.isEmpty(histData)) {
                    toastr.error('未查询到云箱信息，请联系管理员！');
                } else {

                    heatmap = new google.maps.visualization.HeatmapLayer({
                        data: histData,
                        map: map,
                        radius: 20
                    });

                    histData.map(function (item) {
                        bounds.extend(item.location);
                    })

                    map.fitBounds(bounds);
                }

            }, function (err) {
                console.log("Get Historyview Info Failed", err);
            });
        }

        function getOperationOverview() {
            ApiServer.getOperationOverview(function (response) {
            
                $scope.container_num = response.data.container_num;
            }, function (err) {
                console.log("Get getOperationOverview  Info Failed", err);
            });
        }

        $scope.$on("mapResize_from_main_to_children", function () {
            console.log("mapResize in children", map);
            setTimeout(function () {
                google.maps.event.trigger(map, 'resize')
            }, 100);
        })
    }

})();
