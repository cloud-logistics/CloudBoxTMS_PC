/**
 * Created by guankai on 22/05/2017.
 */
(function () {
    'use strict';

    angular.module('smart_container').controller('HistoryController', HistoryController);

    /** @ngInject */
    function HistoryController(constdata, NetworkService, $stateParams, ApiServer, toastr, $state, $timeout, $interval,$scope) {
        /* jshint validthis: true */
        var vm = this;

        vm.title = '报警监控';
        vm.reports = [];
        vm.queryParams = {}

        getContainerReportHistory();

        vm.getContainerReportHistory = getContainerReportHistory
        
        function getContainerReportHistory () {
            ApiServer.getContainerReportHistory(vm.queryParams, function (response) {
                console.log(vm.queryParams);
                vm.reports = response.data.containerReportHistory
                console.log(vm.reports);
            },function (err) {
                console.log("Get ContainerOverview Info Failed", err);
            });
        }
    }

})();