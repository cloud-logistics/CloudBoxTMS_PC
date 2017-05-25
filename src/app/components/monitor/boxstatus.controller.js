/**
 * Created by guankai on 22/05/2017.
 */
(function () {
    'use strict';

    angular.module('smart_container').controller('BoxstatusController', BoxstatusController);

    /** @ngInject */
    function BoxstatusController(constdata, NetworkService, MapService, $stateParams, ApiServer, toastr, $state, $timeout, $interval,$scope) {
        /* jshint validthis: true */
        var vm = this;

        vm.title = '云箱状态汇总';
        vm.containerlist = [];
        vm.queryParams = {}

        getBoxStatus();

        vm.getBoxStatus = getBoxStatus

        function getBoxStatus () {
            ApiServer.getBoxStatus(vm.queryParams, function (response) {
                var transformations = {
                    position: {elapsed: R.add(1), remaining: R.add(-1)}
                };

                console.log(vm.queryParams);

                vm.containerlist = R.map(function(container){
                    var locationName = undefined;

                    MapService.geoCodePosition(container.position)
                    .then(function(results){
                        if(!R.isNil(results)){
                            locationName = R.head(results).formatted_address
                        } else {
                            locationName = "未找到地名"
                        }

                        vm.containerlist = R.map(function(item) {
                            if(item.containerId === container.containerId){
                                item.position = locationName
                            }

                            return item
                        })(vm.containerlist)
                    })
                    .catch(function(status){
                        alert(status)
                    })
                    return container
                })(response.data.boxStatus)
                console.log(vm.containerlist);
            },function (err) {
                console.log("Get ContainerOverview Info Failed", err);
            });
        }
    }


})();
