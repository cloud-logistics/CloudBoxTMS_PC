/**
 * Created by Otherplayer on 16/7/21.
 */
(function () {
    'use strict';

    angular.module('smart_container').controller('DashboardController', DashboardController);

    /** @ngInject */
    function DashboardController($stateParams, ApiServer, toastr, $state, $timeout, $interval,$scope, NetworkService, constdata) {
        /* jshint validthis: true */
        var vm = this;
        vm.operationOverview = {};
        vm.reqPath = 'operationoverview';
        vm.getBasePath = 'rentservice/dashboard/info'
        /*getOperationOverview()
        function getOperationOverview() {
            NetworkService.get(vm.reqPath, null,
                function (response) {
                    vm.operationOverview = response.data
                    initPie(vm.operationOverview.container_location);
                    initLine(vm.operationOverview.container_on_lease_history, vm.operationOverview.container_on_transportation_history);

                }, function (err) {
                    toastr.error(i18n.t('u.GET_DATA_FAILED') + response.status);
                });


        }*/
        vm.statsInfo = {
            box_count: 9,
            site_count: 16,
            enterprise_count: 17
        }
        vm.getDatas = function() {
            NetworkService.get(vm.getBasePath, null, function (response) {

                vm.statsInfo = response.data;


            }, function (response) {
                toastr.error(response.status + ' ' + response.statusText);
            });
        }

    }

})();
