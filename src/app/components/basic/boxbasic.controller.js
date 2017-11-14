/**
 * Created by guankai on 02/06/2017.
 */
(function () {
    'use strict';

    angular.module('smart_container').controller('BoxBasicController', BoxBasicController);

    /** @ngInject */
    function BoxBasicController(constdata, NetworkService, $stateParams, ApiServer, toastr, $state, $timeout, $interval, $scope, optionsTransFunc) {
        /* jshint validthis: true */
        var vm = this;

        vm.title = '报警监控';
        vm.reports = [];
        vm.queryParams = {};
        $scope.transDetail = false;



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
            $state.go('app.edit_boxbasic',{username:item.deviceid, args:{type:'detail', data:item}});

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


        $scope.transportDetail = function(item){
            vm.currentItem = item;
            $scope.transDetail = !$scope.transDetail;
            $scope.getContainerHistory(item.deviceid);

        };

        $scope.getContainerHistory = function(containerId){

            /*NetworkService.get(vm.getBasePath + '/' + username,null,function (response) {
             vm.user = response.data.site_info;

             },function (response) {
             toastr.error(response.status + ' ' + response.statusText);
             });*/
            vm.containerTransDetail = [
                {
                    date:'2017-11-06',
                    inputAll:5,
                    outputAll:3,
                    inputFreezer:5,
                    outputFreezer:3,
                    inputCooler:5,
                    outputCooler:3,
                    inputMedical:5,
                    outputMedical:3,
                    inputOrdinary:5,
                    outputOrdinary:3
                },
                {
                    date:'2017-11-05',
                    inputAll:5,
                    outputAll:3,
                    inputFreezer:5,
                    outputFreezer:3,
                    inputCooler:5,
                    outputCooler:3,
                    inputMedical:5,
                    outputMedical:3,
                    inputOrdinary:5,
                    outputOrdinary:3
                },
                {
                    date:'2017-11-04',
                    inputAll:5,
                    outputAll:3,
                    inputFreezer:5,
                    outputFreezer:3,
                    inputCooler:5,
                    outputCooler:3,
                    inputMedical:5,
                    outputMedical:3,
                    inputOrdinary:5,
                    outputOrdinary:3
                },
                {
                    date:'2017-11-03',
                    inputAll:15,
                    outputAll:13,
                    inputFreezer:5,
                    outputFreezer:3,
                    inputCooler:5,
                    outputCooler:3,
                    inputMedical:5,
                    outputMedical:3,
                    inputOrdinary:5,
                    outputOrdinary:3
                },
                {
                    date:'2017-11-02',
                    inputAll:15,
                    outputAll:13,
                    inputFreezer:5,
                    outputFreezer:3,
                    inputCooler:5,
                    outputCooler:3,
                    inputMedical:5,
                    outputMedical:3,
                    inputOrdinary:5,
                    outputOrdinary:3
                },
                {
                    date:'2017-11-01',
                    inputAll:15,
                    outputAll:13,
                    inputFreezer:5,
                    outputFreezer:3,
                    inputCooler:5,
                    outputCooler:3,
                    inputMedical:5,
                    outputMedical:3,
                    inputOrdinary:5,
                    outputOrdinary:3
                },
                {
                    date:'2017-10-30',
                    inputAll:15,
                    outputAll:13,
                    inputFreezer:5,
                    outputFreezer:3,
                    inputCooler:5,
                    outputCooler:3,
                    inputMedical:5,
                    outputMedical:3,
                    inputOrdinary:5,
                    outputOrdinary:3
                }



            ]

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



        /*var timer = $interval(function(){
            getBasicInfo();
        },constdata.refreshInterval, 500);

        $scope.$on("$destroy", function(){
            $interval.cancel(timer);
        });*/


        /*function getBasicInfo () {
            ApiServer.getBasicInfo({}, function (response) {
                // console.log(Date.parse(vm.queryParams.startTime).toString());
                console.log(response);
                vm.basicInfoManage = response.data.basicInfo;
                console.log(vm.basicInfoManage);
            },function (err) {
                console.log("Get ContainerOverview Info Failed", err);
            });
        }*/


        function getDatas() {

            NetworkService.post(vm.getBasePath,{
                "province_id":0,
                "city_id":0,
                "site_id":0,
                "ava_flag":"",
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
