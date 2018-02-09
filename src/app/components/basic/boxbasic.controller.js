/**
 * Created by guankai on 02/06/2017.
 */
(function () {
    'use strict';

    angular.module('smart_container').controller('BoxBasicController', BoxBasicController);

    /** @ngInject */
    function BoxBasicController(constdata,StorageService, NetworkService, $stateParams, ApiServer, toastr, $state, $timeout, $interval, $scope, optionsTransFunc) {
        /* jshint validthis: true */
        var vm = this;

        vm.title = '报警监控';
        vm.reports = [];
        vm.queryParams = {};

        vm.pageCurrent = 1;
        vm.limit = 10;
        $scope.conf = {
            currentPage: 1,
            itemsPerPage: 10,
            totalItems: 0,
            pagesLength: 15,
            perPageOptions: [10, 20, 30, 40, 50],
            onChange: function(){
                vm.limit = $scope.conf.itemsPerPage;
                vm.pageCurrent = $scope.conf.currentPage;
                getDatas();
            }
        };


        vm.isSearch = false;
        $scope.transDetail = false;


        vm.showEmpty = true;
        vm.showEmptyInfo = '暂无云箱信息';
        vm.showMainSpinner = false;
        vm.selectedStyle={
            true:'bg-selected',
            false:'bg-unselected'
        };

        vm.containerStatusSpec = {
            1:'可租赁',
            2:'租赁中',
            3:'不可用'
        };
        vm.containerStatusLabel = {
            1:'bg-available',
            2:'bg-transporting',
            3:'bg-not-available'
        };



        vm.isViewList = false;
        vm.infoKey = 'container.info';
        vm.storeInfo = {
            isViewList:vm.isViewList
        }

        if(StorageService.get(vm.infoKey) == null){
            StorageService.put(vm.infoKey, vm.storeInfo, 24 * 3 * 60 * 60);
        }
        vm.storeInfo = StorageService.get(vm.infoKey);
        vm.isViewList = vm.storeInfo.isViewList;




        vm.selList = function (isList) {
            vm.isViewList = isList;
            vm.storeInfo = {
                isViewList:vm.isViewList
            }
            StorageService.put(vm.infoKey, vm.storeInfo, 24 * 3 * 60 * 60);

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

        vm.newBasicInfoConfig = {};
        vm.basicInfoManage = {
            basicInfoConfig : {},
            alertConfig: {},
            issueConfig: {}
        };

        vm.saveBasicInfoConfig = saveBasicInfoConfig;
        vm.cancelBasicInfoConfig = cancelBasicInfoConfig;


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

        vm.enterEvent = function(e){
            var keycode = window.event?e.keyCode:e.which;
            if(keycode==13){
                vm.goResetSearch();
            }
        }
        /*vm.goResetSearch = function(){
            vm.pageCurrent = 1;
            vm.targetPage = vm.pageCurrent;
            vm.goSearch();
        }*/
        vm.goResetSearch = function(){
            $scope.conf.currentPage = 1;
            vm.pageCurrent  = 1;
            vm.goSearch();
        }
        vm.goSearch = function(){
            vm.showMainSpinner = true;
            vm.isSearch = true;
            if(vm.searchContainerId == undefined || vm.searchContainerId == null){
                vm.searchContainerId = '';
            }
            NetworkService.post(vm.getBasePath+'?limit='+vm.limit+'&offset='+((vm.pageCurrent - 1) * vm.limit),{
                "province_id":vm.searchProvince,
                "city_id":vm.searchCity,
                "site_id":vm.searchWarehouse,
                "ava_flag":"",
                "box_id":vm.searchContainerId/*,
                limit:vm.limit,
                offset:(vm.pageCurrent - 1) * vm.limit,*/

            },function (response) {
                vm.items = response.data.results;
                vm.showMainSpinner = false;
                if(vm.items != null && vm.items.length > 0){
                    vm.showEmpty = false;
                }else{
                    vm.showEmpty = true;
                    vm.showEmptyInfo = '没搜到符合条件的结果';
                }

                if(vm.items.length > 0){
                    for(var i = 0; i < vm.items.length; i ++){
                        /*if(rent_statusava_flag == 'N'){
                            vm.items[i].curStatus = 3;
                        }else if(vm.items[i].ava_flag=='Y' && (vm.items[i].siteinfo == '' || vm.items[i].siteinfo == null)){
                            vm.items[i].curStatus = 2;
                        }else if(vm.items[i].ava_flag=='Y' && vm.items[i].siteinfo != '' && vm.items[i].siteinfo != null ){
                            vm.items[i].curStatus = 1;
                        }*/
                        vm.items[i].curStatus = 1;
                        if(vm.items[i].rent_status == 0){
                            vm.items[i].curStatus = 1;
                        }else if(vm.items[i].rent_status == 1){
                            vm.items[i].curStatus = 2;
                        }else if(vm.items[i].rent_status == 2){
                            vm.items[i].curStatus = 3;
                        }
                    }
                }
                //console.log(response.data);
                vm.displayedCollection = (vm.items);
                //vm.targetPage = vm.pageCurrent = 1;
                updatePagination(response.data);
            },function (response) {
                vm.showMainSpinner = false;
                toastr.error(response.statusText);
            });




        }

        vm.updateProvinceList = function(oper)
        {
            NetworkService.get(vm.getProvincePath,null,function (response) {
                vm.provinceInfo = response.data;
                vm.provinceInfo.unshift({
                    nation:1,
                    province_id:0,
                    province_name:"所有",
                    zip_code:"000000"
                });
                if(oper == 0) {
                    vm.searchProvince = vm.provinceInfo[0].province_id;
                }
                vm.updateCityList(0);
            },function (response) {
                toastr.error(response.statusText);
            });
        }


        vm.updateCityList = function(oper)
        {
            //vm.searchProvince;
            console.log(vm.searchProvince);
            if(vm.searchProvince != 0)
            {

                console.log(vm.searchProvince);
                NetworkService.get(vm.getCityPath + vm.searchProvince, null, function (response) {
                    vm.cityInfo = response.data;


                    //if(vm.searchProvince == 0){
                        vm.cityInfo.unshift({
                            nation:1,
                            id:0,
                            city_name:"所有"
                        });
                   //}


                    if (oper == 0) {
                        vm.searchCity = vm.cityInfo[0].id;
                    }

                    vm.updateWarehouseList(0);
                }, function (response) {
                    toastr.error(response.statusText);
                });
            }else{
                vm.cityInfo = [
                    {
                        nation:1,
                        id:0,
                        city_name:"所有"
                    }

                ];

                if (oper == 0) {

                    vm.searchCity = vm.cityInfo[0].id;
                }
                vm.updateWarehouseList(0);
            }
        }

        vm.updateWarehouseList = function (oper) {


            if(vm.searchCity != 0) {

                console.log(vm.searchCity);
                NetworkService.get(vm.getWarehousePath + vm.searchProvince + '/city/' + vm.searchCity, {
                    limit: 100,
                    offset: 0
                }, function (response) {
                    vm.warehouseInfo = response.data.results;
                    if(vm.warehouseInfo && vm.warehouseInfo.length > 0) {
                        for (var i = 0; i < vm.warehouseInfo.length; i++) {
                            if (vm.warehouseInfo[i].name.length > 8) {
                                vm.warehouseInfo[i].name = vm.warehouseInfo[i].name.substr(0, 8) + '...';
                            }
                        }
                    }


                    vm.warehouseInfo.unshift({
                        id:0,
                        name:"所有"
                    });

                    if (oper == 0) {
                        vm.searchWarehouse = vm.warehouseInfo[0].id;
                    }
                }, function (response) {
                    toastr.error(response.statusText);
                });
            }else{
                vm.warehouseInfo = [
                    {
                        id:0,
                        name:"所有"
                    }

                ];

                if (oper == 0) {
                    vm.searchWarehouse = vm.warehouseInfo[0].id;
                }
            }


        }
        function getDatas() {

            if(vm.isSearch ){
                vm.goSearch();
            }else {
                vm.showMainSpinner = true;
                NetworkService.post(vm.getBasePath + '?limit=' + vm.limit + '&offset=' + ((vm.pageCurrent - 1) * vm.limit), {
                    "province_id": 0,
                    "city_id": 0,
                    "site_id": 0,
                    "ava_flag": "",
                    "box_id": ""

                }, function (response) {
                    vm.showMainSpinner = false;
                    vm.items = response.data.results;
                    if(vm.items != null && vm.items.length > 0){
                        vm.showEmpty = false;
                    }else{
                        vm.showEmpty = true;
                        vm.showEmptyInfo = '暂无云箱信息';
                    }
                    if (vm.items.length > 0) {
                        for (var i = 0; i < vm.items.length; i++) {

                            /*if(vm.items[i].ava_flag == 'N'){
                             vm.items[i].curStatus = 3;
                             }else if(vm.items[i].ava_flag=='Y' && (vm.items[i].siteinfo == '' || vm.items[i].siteinfo == null)){
                             vm.items[i].curStatus = 2;
                             }else if(vm.items[i].ava_flag=='Y' && vm.items[i].siteinfo != '' && vm.items[i].siteinfo != null ){
                             vm.items[i].curStatus = 1;
                             }*/

                            vm.items[i].curStatus = 1;
                            if (vm.items[i].rent_status == 0) {
                                vm.items[i].curStatus = 1;
                            } else if (vm.items[i].rent_status == 1) {
                                vm.items[i].curStatus = 2;
                            } else if (vm.items[i].rent_status == 2) {
                                vm.items[i].curStatus = 3;
                            }


                        }
                    }
                    //console.log(response.data);
                    vm.displayedCollection = (vm.items);

                    updatePagination(response.data);
                }, function (response) {
                    vm.showMainSpinner = false;
                    toastr.error(response.statusText);
                });
                vm.updateProvinceList(0);
            }

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
            vm.targetPage = vm.pageCurrent;
        };
        vm.nextAction = function () {
            vm.pageCurrent ++;
            getDatas();
            vm.targetPage = vm.pageCurrent;
        };
        vm.goPage = function (page) {
            console.log(page);
            vm.pageCurrent = Number(page);
            console.log(vm.pageCurrent);
            getDatas();
            vm.targetPage = vm.pageCurrent;
        };
        vm.pageCurrentState = function (page) {
            if (Number(page) == vm.pageCurrent)
                return true;
            return false;
        };



        function updatePagination(pageination) {
            if (pageination.results == null || pageination.results.length < 1){
                vm.pageCurrent = 1;
                $scope.conf.currentPage = 1;
                $scope.conf.totalItems = 0;
                return;
            }

            $scope.conf.totalItems = pageination.count;

        }

       /* function updatePagination(pageination) {



            if (pageination.results == null || pageination.results.length < 1){
                // toastr.error('当前无数据哦~');
                vm.pageCurrent = 1;
                vm.targetPage = 1;
                vm.pagePreEnabled = false;
                vm.pageNextEnabled = false;
                vm.pages = ['1'];
                vm.totalPages = 1;

                return;
            }
            var page = parseInt(pageination.offset/pageination.limit +1);
            var toalPages = pageination.count % pageination.limit == 0 ?  parseInt(pageination.count / pageination.limit):parseInt(pageination.count / pageination.limit + 1);
            vm.totalPages = toalPages;
            console.log(page + ';'+ toalPages);
            vm.pageNextEnabled = (vm.pageCurrent ==  toalPages ? false : true);
            vm.pagePreEnabled = (vm.pageCurrent ==  1  ? false : true);

            //vm.targetPage = vm.pageCurrent = 1;
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

        }*/



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
