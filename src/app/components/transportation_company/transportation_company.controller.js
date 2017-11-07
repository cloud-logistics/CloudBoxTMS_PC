/**
 * Created by Otherplayer on 16/7/25.
 */
(function () {
    'use strict';

    angular
        .module('smart_container')
        .controller('TransportationCompanyController', TransportationCompanyController);

    /** @ngInject */
    function TransportationCompanyController(NetworkService,StorageService,constdata,$state,$rootScope, $uibModal,$log,toastr,i18n, delmodaltip) {
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
        vm.goSearch = goSearch;

        vm.displayedCollection = [];
        vm.subPath = 'accounts';
        vm.addBasePath =  'rentservice/enterprise/enterpriseinfo/addenterpriseinfo/';
        vm.getBasePath =  'rentservice/enterprise/enterpriseinfo/list';
        vm.updateBasePath =  'rentservice/enterprise/enterpriseinfo/updateenterpriseinfo/';
        vm.delBasePath =  'rentservice/enterprise/enterpriseinfo/';

        vm.deposit_confirm =  'rentservice/enterprise/enterpriseinfo';
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

        vm.OperApp = OperApp;

        function OperApp(index, item) {
            if(index == 3){

                NetworkService.post(vm.deposit_confirm + '/'+ item.id,null,function (response) {
                    toastr.success(i18n.t('u.OPERATE_SUC'));
                    getDatas();
                },function (response) {
                    vm.authError = response.statusText + '(' + response.status + ')';
                    toastr.error(vm.authError);
                });

            }/*else{
                console.log('error ops:'+index);
            }*/

            //$state.go('app.applicationedit');
        }



        function goSearch() {
            console.log(vm.searchItem);
        };

        function getDatas() {
            console.log(vm.pageCurrent);
            NetworkService.get(vm.getBasePath,{limit:vm.limit, offset:(vm.pageCurrent - 1) * vm.limit},function (response) {
                console.log(response.data);
                vm.items = response.data.results;
                vm.displayedCollection = (vm.items);
                updatePagination(response.data);
                //vm.displayedCollection = [].concat(vm.items);
            },function (response) {
                toastr.error(response.status + ' ' + response.statusText);
            });
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
                toastr.error(response.status + ' ' + response.statusText);
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