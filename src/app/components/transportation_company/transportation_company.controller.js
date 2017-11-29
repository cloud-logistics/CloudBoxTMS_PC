/**
 * Created by Otherplayer on 16/7/25.
 */
(function () {
    'use strict';

    angular
        .module('smart_container')
        .controller('TransportationCompanyController', TransportationCompanyController);

    /** @ngInject */
    function TransportationCompanyController($scope, NetworkService,StorageService,constdata,$state,$rootScope, $uibModal,$log,toastr,i18n, delmodaltip) {
        /* jshint validthis: true */
        var vm = this;
        vm.authError = null;

        vm.pageCurrent = 1;
        vm.targetPage = 1;
        vm.pagePreEnabled = false;
        vm.pageNextEnabled = false;
        vm.pages = [];

        vm.items = [];
        vm.showItems = [];

        vm.goAddItem = goAddItem;
        vm.goEditItem = goEditItem;
        vm.goDetail = goDetail;
        vm.removeItem = removeItem;
        vm.curItem = {};
        vm.backAction = backAction;

        vm.displayedCollection = [];
        vm.subPath = 'accounts';
        vm.addBasePath =  'rentservice/enterprise/enterpriseinfo/addenterpriseinfo/';
        vm.getBasePath =  'rentservice/enterprise/enterpriseinfo/list';
        vm.updateBasePath =  'rentservice/enterprise/enterpriseinfo/updateenterpriseinfo/';
        vm.delBasePath =  'rentservice/enterprise/enterpriseinfo/';

        vm.deposit_confirm =  'rentservice/enterprise/enterpriseinfo/depositconfirm';
        vm.isAdmin = false;
        vm.limit = 10;

        vm.labelColor = {
            1:'bg-success',
            0:'bg-danger'
        };
        vm.labelContent={
            0:'未缴',
            1:'已缴',
        };
        vm.searchItem = '';
        vm.isSearch = false;

        vm.OperApp = OperApp;

        function OperApp(index, item) {
            if(index == 3){

                vm.openOper('sm', item);

            }else  if(index == 4){
                $state.go('app.edit_transportation_company_user',{args:{type:'edit_from_company', enterprise_id:item.enterprise_id,enterprise_name:item.enterprise_name}});
            }else  if(index == 5){
                $state.go('app.transportation_company_user', {args:{enterprise_id:item.enterprise_id,enterprise_name:item.enterprise_name}});
            }


            //$state.go('app.applicationedit');
        }


        vm.enterEvent = function(e){
            var keycode = window.event?e.keyCode:e.which;
            if(keycode==13){
                vm.goSearch();
            }
        }
        vm.confirmDeposit = function(item)
        {
            NetworkService.put(vm.deposit_confirm,{enterprise_id:item.enterprise_id},function (response) {
                toastr.success('操作成功');
                getDatas();
            },function (response) {
                toastr.error(response.statusText);
            });
        }
         vm.goSearch = function() {
             //rentservice/enterprise/enterpriseinfo/fuzzy
            //console.log(vm.searchItem);
             vm.isSearch = true;
             var params = {
                 keyword:vm.searchItem
             };
             NetworkService.post('rentservice/enterprise/enterpriseinfo/fuzzy?'+'limit='+vm.limit+'&offset='+((vm.pageCurrent - 1) * vm.limit),params,function (response) {
                 console.log(response.data);
                 vm.items = response.data.results;
                 vm.displayedCollection = (vm.items);
                 updatePagination(response.data);
                 //vm.displayedCollection = [].concat(vm.items);
             },function (response) {
                 toastr.error(response.statusText);
             });
        };

        function getDatas() {
            if(vm.isSearch ){
                vm.goSearch();
            }else {
                console.log(vm.pageCurrent);
                NetworkService.get(vm.getBasePath, {
                    limit: vm.limit,
                    offset: (vm.pageCurrent - 1) * vm.limit
                }, function (response) {
                    console.log(response.data);
                    vm.items = response.data.results;
                    vm.displayedCollection = (vm.items);
                    updatePagination(response.data);
                    //vm.displayedCollection = [].concat(vm.items);
                }, function (response) {
                    toastr.error(response.statusText);
                });
            }
        }


        function goAddItem() {
            $state.go('app.edit_transportation_company',{});
        };

        function goEditItem(item) {
            $state.go('app.edit_transportation_company',{username:item.enterprise_id, args:{type:'edit'}});
        };

        function goDetail(item) {
            $state.go('app.edit_transportation_company',{username:item.enterprise_id, args:{type:'detail'}});

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
                // toastr.error('当前无数据哦~');
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

        }

        getDatas();


        //Model




        vm.openAlert = function (size,model) {
            vm.tipsInfo = delmodaltip;
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


        vm.openOper = function (size,model) {
            var tip = {
                title: '押金确认',
                content: '请确认押金已经交付'
            };
            vm.tipsInfo = tip;
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
                vm.confirmDeposit(model);
            }, function () {
            });
        }




    }

})();
