/**
 * Created by guankai on 02/06/2017.
 */
(function () {
    'use strict';

    angular.module('smart_container').controller('ReportController', ReportController);

    /** @ngInject */
    function ReportController(constdata, NetworkService, $stateParams, ApiServer, toastr, $state, $timeout, $interval, $scope, optionsTransFunc) {
        /* jshint validthis: true */
        var vm = this;

        vm.title = '报警监控';
        vm.reports = [];
        vm.queryParams = {};
        $scope.transDetail = false;

        vm.pageCurrent = 1;
        vm.targetPage = 1;
        vm.pagePreEnabled = false;
        vm.pageNextEnabled = false;
        vm.pages = [];
        vm.limit = 10;

        vm.selectedStyle={
            true:'bg-selected',
            false:'bg-unselected'
        };

        vm.containerStatusSpec = {
            1:'可租用',
            2:'运输中',
            3:'不可用'
        };
        vm.containerStatusLabel = {
            1:'bg-available',
            2:'bg-transporting',
            3:'bg-not-available'
        };



        vm.isViewList = false;
        vm.selList = function (isList) {
            vm.isViewList = isList;
            console.log('dd');

        }





        vm.goDetail= function(item) {
            $state.go('app.edit_report',{username:item.id, args:{type:'detail', data:item}});

        };
        $scope.basicUpdate = function(item){
            vm.options = R.merge(vm.options, {
                title: "云箱详情",
                is_insert: false
            })

            $scope.bbUpdate = !$scope.bbUpdate;
            vm.currentItem = item;
            // $scope.modalUpdate = !$scope.modalUpdate;
        };

        vm.newBasicInfoConfig = {};
        vm.basicInfoManage = {
            basicInfoConfig : {},
            alertConfig: {},
            issueConfig: {}
        };

        vm.saveBasicInfoConfig = saveBasicInfoConfig;
        vm.cancelBasicInfoConfig = cancelBasicInfoConfig;
        vm.targetPage = 1;
        vm.pageCurrent = 1;

        vm.addBasePath =  'basicInfoConfig/';
        vm.getBasePath =  'rentservice/boxinfo/query';
        vm.updateBasePath =  'basicInfoMod/';
        vm.delBasePath =  'basicInfo/';

        vm.getProvincePath = 'rentservice/regions/provinces';
        vm.getCityPath = 'rentservice/regions/cities/';
        vm.getWarehousePath =  'rentservice/site/list/province/';

        vm.options = {};
        var transformations = undefined;

        var requiredOptions = [
                    "carrier",
                    "factory",
                    "factoryLocation",
                    "batteryInfo",
                    "hardwareInfo",
                    "intervalTime",
                    "maintenanceLocation",
                    "containerType",
                    "alertCode",
                    "alertType",
                    "alertLevel"
                ];

        vm.isProvinceEnable = true;
        vm.isCityEnable = true;
        vm.isWarehouseEnable = true;
        vm.searchProvince = 1;
        vm.searchCity = 1;
        vm.searchWarehouse = 1;

        vm.goSearch = function(){
            NetworkService.post(vm.getBasePath,{
                "province_id":vm.searchProvince,
                "city_id":vm.searchCity,
                "site_id":vm.searchWarehouse,
                "ava_flag":"",
                "box_id":vm.searchContainerId,
                limit:vm.limit,
                offset:(vm.pageCurrent - 1) * vm.limit,

            },function (response) {
                vm.items = response.data.results;

                if(vm.items.length > 0){
                    for(var i = 0; i < vm.items.length; i ++){
                        if(vm.items[i].ava_flag == 'N'){
                            vm.items[i].curStatus = 3;
                        }else if(vm.items[i].ava_flag=='Y' && (vm.items[i].siteinfo == '' || vm.items[i].siteinfo == null)){
                            vm.items[i].curStatus = 2;
                        }else if(vm.items[i].ava_flag=='Y' && vm.items[i].siteinfo != '' && vm.items[i].siteinfo != null ){
                            vm.items[i].curStatus = 1;
                        }
                    }
                }
                //console.log(response.data);
                vm.displayedCollection = (vm.items);

                updatePagination(response.data);
            },function (response) {
                toastr.error(response.status + ' ' + response.statusText);
            });




        }


        function getDatas() {

            /*NetworkService.get('rentservice/boxinfo/leaselist/' + username,{limit:vm.limit, offset:(vm.pageCurrent - 1) * vm.limit},function (response) {
                vm.containerHistory = response.data.results;
                updatePagination(response.data);

            },function (response) {
                toastr.error(response.status + ' ' + response.statusText);
            });*/

            vm.items = [
                {
                    id:1,
                    enterpriseName:'大秦货运物流集团',
                    usingContainerNum:'230',
                    usedContainerNum:'320',
                    amount:'23212.5'
                },
                {
                    id:1,
                    enterpriseName:'海航海运集团',
                    usingContainerNum:'1320',
                    usedContainerNum:'872',
                    amount:'323252'
                },
                {
                    id:1,
                    enterpriseName:'大秦货运物流集团',
                    usingContainerNum:'230',
                    usedContainerNum:'320',
                    amount:'23212.5'
                },
                {
                    id:1,
                    enterpriseName:'海航海运集团',
                    usingContainerNum:'1320',
                    usedContainerNum:'872',
                    amount:'323252'
                },
                {
                    id:1,
                    enterpriseName:'大秦货运物流集团',
                    usingContainerNum:'230',
                    usedContainerNum:'320',
                    amount:'23212.5'
                },
                {
                    id:1,
                    enterpriseName:'海航海运集团',
                    usingContainerNum:'1320',
                    usedContainerNum:'872',
                    amount:'323252'
                }
            ]

        }




        function backAction() {
            // $state.go('app.tenant');
            $rootScope.backPre();
        }

        // 分页 Start
        vm.preAction = function () {
            vm.pageCurrent --;
            if (vm.pageCurrent < 1) vm.pageCurrent = 1;
            getDatas();
        };
        vm.nextAction = function () {
            vm.pageCurrent ++;
            getDatas();
        };
        vm.goPage = function (page) {
            console.log(page);
            vm.pageCurrent = Number(page);
            console.log(vm.pageCurrent);
            getDatas();
        };
        vm.pageCurrentState = function (page) {
            if (Number(page) == vm.pageCurrent)
                return true;
            return false;
        };

        function updatePagination(pageination) {
            if (pageination.results == null || pageination.results.length < 1){
                // toastr.error('当前无数据哦~');
                return;
            }
            var page = parseInt(pageination.offset/pageination.limit +1);
            var toalPages = parseInt(pageination.count / pageination.limit + 1);
            vm.totalPages = toalPages;
            console.log(page + ';'+ toalPages);
            vm.pageNextEnabled = (vm.pageCurrent ==  toalPages ? false : true);
            vm.pagePreEnabled = (vm.pageCurrent ==  1  ? false : true);


            if (toalPages < 2){
                vm.pages = ['1'];
            }else{
                vm.pages = [];
                var pageControl = 5;
                var stepStart = page - (pageControl - 1)/2;
                if (stepStart < 1 || toalPages < pageControl) stepStart = 1;
                var stepEnd = stepStart + pageControl - 1;
                if (stepEnd > toalPages) {
                    stepEnd = toalPages;
                    stepStart = toalPages - pageControl + 1;
                    if (stepStart < 1){
                        stepStart = 1;
                    }
                }

                for (var i=stepStart;i<= (stepEnd > toalPages ? toalPages : stepEnd);i++) {
                    vm.pages.push(i);
                }
            }

        }



        getDatas();

        function saveBasicInfoConfig() {
            newBasicInfoConfigPost();
            $scope.bbUpdate = false;
        }

        function cancelBasicInfoConfig() {
            $scope.bbUpdate = false;
        }

        function newBasicInfoConfigPost () {
            var config = R.evolve(transformations)(vm.newBasicInfoConfig)
            console.log("new basicInfo params: ", config);
            ApiServer.newBasicInfoConfig(config, function (response) {
                console.log(response.data.code);
            },function (err) {
                console.log("Get ContainerOverview Info Failed", err);
            });
        }

        function inputTransFunc (num) {
            return parseInt(num, 10)
        }

    }

})();
