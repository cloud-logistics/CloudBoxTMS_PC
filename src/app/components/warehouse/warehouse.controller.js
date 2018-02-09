/**
 * Created by Otherplayer on 16/7/25.
 */
(function () {
    'use strict';

    angular
        .module('smart_container')
        .controller('WarehouseController', WarehouseController);

    /** @ngInject */
    function WarehouseController($scope, NetworkService,StorageService,constdata,$state,$rootScope, $uibModal,$log,toastr,i18n, delmodaltip) {
        /* jshint validthis: true */
        var vm = this;
        vm.authError = null;

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

        vm.items = [];
        vm.showItems = [];

        vm.goAddItem = goAddItem;
        vm.goEditItem = goEditItem;
        vm.goDetail = goDetail;
        vm.removeItem = removeItem;
        vm.curItem = {};
        vm.backAction = backAction;
        vm.goSearch = goSearch;

        vm.displayedCollection = [];
        vm.subPath = 'accounts';
        vm.addBasePath =  'sites/';
        vm.getBasePath =  'rentservice/site/list/province/0/city/0';
        vm.updateBasePath =  'sites/';
        vm.delBasePath =  'sites/';
        vm.isAdmin = false;
        vm.showEmpty = true;
        vm.showEmptyInfo = '暂无仓库信息';
        vm.showMainSpinner = false;

        vm.labelColor = {
            enabled:'bg-success',
            locked:'bg-danger',
            'member':'bg-main',
            'silver':'bg-main',
            'gold':'bg-main',
            'platinum':'bg-main',
            'diamond':'bg-main'
        };
        vm.labelContent={
            enabled:'已启用',
            locked:'已锁定',
            'member':'普通会员',
            'silver':'白银会员',
            'gold':'黄金会员',
            'platinum':'铂金会员',
            'diamond':'钻石会员'
        };

        vm.selectedStyle={
            true:'bg-selected',
            false:'bg-unselected'
        };


        vm.isViewList = false;
        vm.infoKey = 'warehouse.info';
        vm.storeInfo = {
            isViewList:vm.isViewList
        }

        if(StorageService.get(vm.infoKey) == null){
            StorageService.put(vm.infoKey, vm.storeInfo, 24 * 3 * 60 * 60);
        }
        vm.storeInfo = StorageService.get(vm.infoKey);
        vm.isViewList = vm.storeInfo.isViewList;


        vm.OperApp = OperApp;
        vm.selList = function (isList) {
            vm.isViewList = isList;
            vm.storeInfo = {
                isViewList:vm.isViewList
            }
            StorageService.put(vm.infoKey, vm.storeInfo, 24 * 3 * 60 * 60);


        }
        vm.enterEvent = function(e){
            var keycode = window.event?e.keyCode:e.which;
            if(keycode==13){
                vm.goResetSearch();
            }
        }
        vm.searchWarehouse = '';
        function OperApp(index, item) {
        }
        vm.isSearch = false;
        $scope.parseFloat = parseFloat;

        vm.processDatas = function (response){
            vm.items = response.data.results;
            if(vm.items.length > 0) {
                for (var i = 0; i < vm.items.length; i++) {

                    //var allNum = 0;
                    vm.items[i].freezerBoxInfo  = {
                        availableNum:0,
                        allNum:0
                    };
                    vm.items[i].coolerBoxInfo = {
                        availableNum:0,
                        allNum:0
                    };
                    vm.items[i].medicalBoxInfo = {
                        availableNum:0,
                        allNum:0
                    };
                    vm.items[i].ordinaryBoxInfo = {
                        availableNum:0,
                        allNum:0
                    };
                    vm.items[i].specialBoxInfo = {
                        availableNum:0,
                        allNum:0
                    };
                    vm.items[i].allCurrentBoxInfo = {
                        availableNum:0,
                        allNum:0
                    };

                    if(vm.items[i].box_num != null && vm.items[i].box_num.length > 0) {
                    for (var j = 0; j < vm.items[i].box_num.length; j++) {
                        vm.items[i].allCurrentBoxInfo.allNum += vm.items[i].box_num[j].ava_num;
                        vm.items[i].allCurrentBoxInfo.availableNum += vm.items[i].box_num[j].ava_num - vm.items[i].box_num[j].reserve_num;

                        /*if (vm.items[i].box_num[j].box_type.id == 1) {
                            vm.items[i].freezerBoxInfo.allNum = vm.items[i].box_num[j].ava_num;
                            vm.items[i].freezerBoxInfo.availableNum = vm.items[i].box_num[j].ava_num - vm.items[i].box_num[j].reserve_num;
                        } else if (vm.items[i].box_num[j].box_type.id == 2) {
                            vm.items[i].coolerBoxInfo.allNum = vm.items[i].box_num[j].ava_num;
                            vm.items[i].coolerBoxInfo.availableNum = vm.items[i].box_num[j].ava_num -  vm.items[i].box_num[j].reserve_num;

                        } else if (vm.items[i].box_num[j].box_type.id == 3) {
                            vm.items[i].medicalBoxInfo.allNum = vm.items[i].box_num[j].ava_num;
                            vm.items[i].medicalBoxInfo.availableNum = vm.items[i].box_num[j].ava_num -  vm.items[i].box_num[j].reserve_num;;

                        } else if (vm.items[i].box_num[j].box_type.id == 4) {
                            vm.items[i].ordinaryBoxInfo.allNum = vm.items[i].box_num[j].ava_num;
                            vm.items[i].ordinaryBoxInfo.availableNum = vm.items[i].box_num[j].ava_num - vm.items[i].box_num[j].reserve_num;;
                        } else if (vm.items[i].box_num[j].box_type.id == 5) {
                            vm.items[i].specialBoxInfo.allNum = vm.items[i].box_num[j].ava_num;
                            vm.items[i].specialBoxInfo.availableNum = vm.items[i].box_num[j].ava_num - vm.items[i].box_num[j].reserve_num;;
                        }*/
                    }
                }

                    /*
                   vm.items[i].allCurrentBoxInfo.allNum = vm.items[i].freezerBoxInfo.allNum +  vm.items[i].coolerBoxInfo.allNum
                        + vm.items[i].medicalBoxInfo.allNum + vm.items[i].ordinaryBoxInfo.allNum + vm.items[i].specialBoxInfo.allNum;
                    vm.items[i].allCurrentBoxInfo.availableNum = vm.items[i].freezerBoxInfo.availableNum +  vm.items[i].coolerBoxInfo.availableNum
                        + vm.items[i].medicalBoxInfo.availableNum + vm.items[i].ordinaryBoxInfo.availableNum + vm.items[i].specialBoxInfo.availableNum;*/


                }
            }
            vm.displayedCollection = (vm.items);

            updatePagination(response.data);
        };

        vm.goResetSearch = function(){
            $scope.conf.currentPage = 1;
            vm.pageCurrent  = 1;
            vm.goSearch();
        }

        function goSearch() {
            vm.isSearch = true;
            vm.showMainSpinner = true;
            var params = {
                site_name:vm.searchWarehouse
                /*,
                limit:vm.limit,
                offset:(vm.pageCurrent - 1) * vm.limit*/
            }
            NetworkService.post('rentservice/site/filter?limit='+vm.limit+'&offset='+((vm.pageCurrent - 1) * vm.limit),params,function (response) {
                vm.showMainSpinner = false;
                if(response.data.results != null && response.data.results.length > 0){
                    vm.showEmpty = false;

                }else{
                    vm.showEmpty = true;
                    vm.showEmptyInfo = '没搜到符合条件的结果';
                }
                vm.processDatas(response);
            },function (response) {
                vm.showMainSpinner = false;
                vm.authError = response.statusText + '(' + response.status + ')';
                toastr.error(vm.authError);
            });

        };

        function getDatas() {
            if(vm.isSearch){
                vm.goSearch();
            }else {
                vm.showMainSpinner = true;

                NetworkService.get(vm.getBasePath, {
                    limit: vm.limit,
                    offset: (vm.pageCurrent - 1) * vm.limit
                }, function (response) {
                    vm.showMainSpinner = false;
                    if(response.data.results != null && response.data.results.length > 0){
                        vm.showEmpty = false;
                    }else{
                        vm.showEmpty = true;
                        vm.showEmptyInfo = '暂无仓库信息';
                    }
                    vm.processDatas(response);
                    //vm.displayedCollection = [].concat(vm.items);
                }, function (response) {
                    vm.showMainSpinner = false;
                    toastr.error(response.statusText);
                });
            }
        };


        function goAddItem() {
            $state.go('app.edit_warehouse',{});
        };

        function goEditItem(item) {
            $state.go('app.edit_warehouse',{username:item.id, args:{type:'edit'}});
        };

        function goDetail(item) {
            $state.go('app.edit_warehouse',{username:item.id, args:{type:'detail'}});

        };


        function removeItem(item) {
            NetworkService.delete(vm.delBasePath  + '/' + item.enterprise_id,null,function success() {
                var index = vm.items.indexOf(item);
                toastr.success('删除成功！');
                getDatas();
            },function (response) {
                toastr.error(response.statusText);
            });

        };
        function backAction() {
            // $state.go('app.tenant');
            $rootScope.backPre();
        }

        vm.displayedCollection = [].concat(vm.items);


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

        getDatas();


        //Model

        vm.tipsInfo = delmodaltip;
        vm.openAlert = function (size,model) {
            var modalInstance = $uibModal.open({
                templateUrl: 'myModalContent.html',
                size: size,
                controller:'ModalInstanceCtrl',
                resolve: {
                    tipsInfo: function () {
                        return vm.tipsInfo;
                    }
                }
            });
            modalInstance.result.then(function (param) {
                vm.removeItem(model);
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        }




    }

})();
