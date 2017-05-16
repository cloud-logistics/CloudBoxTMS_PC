/**
 * Created by Otherplayer on 16/7/21.
 */
(function () {
    'use strict';

    angular.module('smart_container').controller('TransportTaskController', TransportTaskController);

    /** @ngInject */
    function TransportTaskController($state,toastr,ApiServer) {
        /* jshint validthis: true */
        var vm = this;

        var info = ApiServer.info();

        vm.titles = ['车辆编号','驾驶人','联系方式','驾驶证号','起始','到达'];

        vm.items = [];

        function getData() {

            ApiServer.transportTaskGetByOwner(info.id,function (res) {
                console.log(res);
                vm.items = res.data;
            },function (err) {
                var errInfo = '获取信息失败：' + err.statusText + ' (' + err.status +')';
                toastr.error(errInfo);
            });
        }

        getData();

    }

})();
