/**
 * Created by Otherplayer on 16/7/25.
 */
(function () {
    'use strict';

    angular
        .module('smart_container')
        .controller('TransportationCompanyUserController', TransportationCompanyUserController);

    /** @ngInject */
    function TransportationCompanyUserController(NetworkService,StorageService,constdata,$state,$rootScope, $uibModal,$log,toastr,i18n, delmodaltip) {
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
        vm.addBasePath =  'rentservice/enterpriseuser/addenterpriseuser/';
        vm.getBasePath =  'rentservice/enterpriseuser/list';
        vm.updateBasePath =  'rentservice/enterpriseuser/updateenterpriseuser/';
        vm.delBasePath =  'rentservice/enterpriseuser/';
        vm.isAdmin = false;


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
            'admin':'管理员',
            'user':'用户',

        };
        vm.labelGroupContent={
            'admin':'超级管理员',
            'rentadmin':'企业管理员',
            'rentuser':'企业用户'
        };

        vm.OperApp = OperApp;
        vm.limit = 10;
        function OperApp(index, item) {
            /*if(index == 3){

                NetworkService.post(vm.reqPath + '/' + vm.subPath  +'/'+ item.id + '/lock',null,function (response) {
                    toastr.success(i18n.t('u.OPERATE_SUC'));
                    getDatas();
                },function (response) {
                    vm.authError = response.statusText + '(' + response.status + ')';
                    toastr.error(vm.authError);
                });

            }else{
                console.log('error ops:'+index);
            }*/

            //$state.go('app.applicationedit');
        }



        function goSearch() {
            console.log(vm.searchItem);
        };

        function getDatas() {

            NetworkService.get(vm.getBasePath+'/rentuser',{limit:vm.limit, offset:(vm.pageCurrent - 1) * vm.limit},function (response) {
                vm.items = response.data.results;
                vm.displayedCollection = (vm.items);
                //vm.displayedCollection = [].concat(vm.items);
            },function (response) {
                toastr.error(response.status + ' ' + response.statusText);
            });
        }


        function goAddItem() {
            $state.go('app.edit_transportation_company_user',{});
        };

        function goEditItem(item) {
            $state.go('app.edit_transportation_company_user',{username:item.user_id, args:{type:'edit'}});
        };

        function goDetail(item) {
            $state.go('app.edit_transportation_company_user',{username:item.user_id, args:{type:'detail'}});

        };


        function removeItem(item) {
            NetworkService.delete(vm.delBasePath  + '/' + item.user_id,null,function success() {
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
            vm.pageCurrent = Number(page);
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

        };

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
