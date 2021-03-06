/**
 * Created by guankai on 02/06/2017.
 */
(function () {
    'use strict';

    angular.module('smart_container').controller('OrderController', OrderController);

    /** @ngInject */
    function OrderController(constdata, NetworkService, $stateParams, ApiServer, toastr, $state, $timeout, $interval, $scope, optionsTransFunc) {
        /* jshint validthis: true */
        var vm = this;

        vm.title = '报警监控';
        vm.reports = [];
        vm.queryParams = {};
        $scope.transDetail = false;

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


        vm.showEmpty = true;
        vm.showEmptyInfo = '暂无报表信息';
        vm.showMainSpinner = false;
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


        vm.boxDetailInfo = [
            {
                id:'1232323',
                type:'冷藏云箱',
                temperature:'23.2',
                position:'陕西西安',
                outTime:'2012-11-11 14:22',
                returnTime:'2012-11-11 14:22',
                elapse:'180天18小时23分',
                status:'待归还',


                planUseTime:'100天18小时23分',
                feeModel:'日租 13.8元／天 押金324元／箱',
                planRent:'¥23.5',
                realRent:'¥43.5',
                toAddRent:'¥20.0'


            },
            {
                id:'1232323',
                type:'冷藏云箱',
                temperature:'23.2',
                position:'陕西西安',
                outTime:'2012-11-11 14:22',
                returnTime:'2012-11-11 14:22',
                elapse:'180天18小时23分',
                status:'已归还',
                planUseTime:'100天18小时23分',
                feeModel:'日租 13.8元／天 押金324元／箱',
                planRent:'¥23.5',
                realRent:'¥43.5',
                toAddRent:'¥20.0'


            }




        ];





        vm.isViewList = false;
        vm.selList = function (isList) {
            vm.isViewList = isList;
            console.log('dd');

        };


        vm.allProgress = [
            {
                title:'已预约',
                isActive:true
            },
            {
                title:'已接单',
                isActive:false
            },
            {
                title:'已交箱',
                isActive:false
            },
            {
                title:'派送中',
                isActive:false
            },
            {
                title:'使用中',
                isActive:false
            },
            {
                title:'待归还',
                isActive:false
            },
            {
                title:'已归还',
                isActive:false
            }



        ];
        vm.payTitle = "待付款";
        vm.isPay = false;
        var status = $stateParams.args.status;
        if(status && status=='nopay'){
            vm.payTitle = "待付款";
            vm.isPay = false;

            vm.allProgress[1].isActive = false;
            vm.allProgress[2].isActive = false;





        }else if(status && status=='pay'){
            vm.payTitle = "收款成功";
            vm.isPay = true;


            vm.allProgress[1].isActive = true;

        }else if(status && status=='inuse'){
            vm.payTitle = "收款成功";

            vm.isPay = true;

            vm.allProgress[1].isActive = true;
            vm.allProgress[2].isActive = true;

            var map = new BMap.Map("map-order",{minZoom:1,maxZoom:10});
            var point = new BMap.Point(116.404, 39.915);  // 创建点坐标
            map.centerAndZoom(point, 15);
            map.enableScrollWheelZoom(true);



        }else if(status && status=='paid'){



        }



        vm.sel = function(oper){
            for(var i = 0; i < vm.tabBoxPriceItem.length; i ++){
                if(vm.tabBoxPriceItem[i].id == oper){
                    vm.tabBoxPriceItem[i].active = true;
                }else{
                    vm.tabBoxPriceItem[i].active = false;
                }
            }
            vm.curSel = oper;
        };

        vm.tabBoxPriceItem =
            [{
                title:'日租',
                active:true,
                id:1

            },
                {
                    title:'月租',
                    active:false,
                    id:2

                }
                ,
                {
                    title:'半年租',
                    active:false,
                    id:3

                }
            ];






        vm.addOrder = function()
        {
            $state.go('app.add-order',{});

        }
        vm.goPaidOrder = function()
        {
            $state.go('app.order-paid',{args:{status:'paid'}});

        }
        vm.appointOrder = function()
        {
            vm.payTitle = "待付款";
            vm.isPay = false;
            vm.allProgress[1].isActive = false;
            $state.go('app.appoint-order',{});
        }
        vm.payOrder = function()
        {
            vm.payTitle = "收款成功";
            vm.isPay = true　;
            vm.allProgress[1].isActive = true;

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
        vm.isSearch = false;
        vm.searchItem = '';
        vm.enterEvent = function(e){
            var keycode = window.event?e.keyCode:e.which;
            if(keycode==13){
                vm.goResetSearch();
            }
        }
        vm.goResetSearch = function(){
            $scope.conf.currentPage = 1;
            vm.pageCurrent  = 1;
            vm.goSearch();
        }
        vm.goSearch = function(){

            vm.showMainSpinner = true;
            var params = {
                keyword:vm.searchItem
            };
            vm.isSearch = true;

            NetworkService.post('rentservice/boxbill/filtertotalbill?limit='+vm.limit+'&offset='+((vm.pageCurrent - 1) * vm.limit),params,function (response) {
                vm.showMainSpinner = false;
                vm.itemsTmp = response.data.results;
                if(vm.itemsTmp != null && vm.itemsTmp.length > 0){
                    vm.showEmpty = false;
                }else{
                    vm.showEmpty = true;
                    vm.showEmptyInfo = '没搜到符合条件的结果';
                }
                updatePagination(response.data);
                vm.items = [];
                if(vm.itemsTmp != null && vm.itemsTmp.length > 0){
                    for(var i = 0; i < vm.itemsTmp.length; i ++){
                        vm.items[i] = {};
                        vm.items[i].id = vm.itemsTmp[i].enterprise_id;
                        vm.items[i].enterpriseName = vm.itemsTmp[i].enterprise_name;
                        vm.items[i].usingContainerNum = vm.itemsTmp[i].off_num;
                        vm.items[i].usedContainerNum = vm.itemsTmp[i].on_num;
                        vm.items[i].amount = vm.itemsTmp[i].fee;
                    }
                }

            },function (response) {
                vm.showMainSpinner = false;
                toastr.error(response.statusText);
            });




        }


        function getDatas() {
            vm.showMainSpinner = true;
            if(vm.isSearch){
                vm.goSearch();
            }else {
                //http://106.2.20.185:8000/container/api/v1/cloudbox/rentservice/boxbill/realtimebill
                NetworkService.get('rentservice/boxbill/realtimebill', {
                    limit: vm.limit,
                    offset: (vm.pageCurrent - 1) * vm.limit
                }, function (response) {
                    vm.showMainSpinner = false;
                    vm.itemsTmp = response.data.results;
                    if(vm.itemsTmp != null && vm.itemsTmp.length > 0){
                        vm.showEmpty = false;
                    }else{
                        vm.showEmpty = true;
                        vm.showEmptyInfo = '暂无报表信息';
                    }

                    updatePagination(response.data);
                    vm.items = [];
                    if (vm.itemsTmp != null && vm.itemsTmp.length > 0) {
                        for (var i = 0; i < vm.itemsTmp.length; i++) {
                            vm.items[i] = {};
                            vm.items[i].id = vm.itemsTmp[i].enterprise_id;
                            vm.items[i].enterpriseName = vm.itemsTmp[i].enterprise_name;
                            vm.items[i].usingContainerNum = vm.itemsTmp[i].off_num;
                            vm.items[i].usedContainerNum = vm.itemsTmp[i].on_num;
                            vm.items[i].amount = vm.itemsTmp[i].fee;
                        }
                    }

                }, function (response) {
                    vm.showMainSpinner = false;
                    toastr.error(response.statusText);
                });
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

        /*function updatePagination(pageination) {
            if (pageination.results == null || pageination.results.length < 1){
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

        function updatePagination(pageination) {
            if (pageination.results == null || pageination.results.length < 1){
                vm.pageCurrent = 1;
                $scope.conf.currentPage = 1;
                $scope.conf.totalItems = 0;
                return;
            }

            $scope.conf.totalItems = pageination.count;

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
