/**
 * Created by Otherplayer on 16/7/25.
 */
(function () {
    'use strict';

    angular
        .module('smart_container')
        .controller('TransportationCompanyUserController', TransportationCompanyUserController);

    /** @ngInject */
    function TransportationCompanyUserController(NetworkService,StorageService,constdata,$state,$rootScope, $uibModal,$log,toastr,i18n, delmodaltip, $stateParams) {
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

        vm.infoKey = 'all.info';

        if($stateParams.args.enterprise_id != null){
            var entInfo = {
                enterprise_id:$stateParams.args.enterprise_id,
                enterprise_name:$stateParams.args.enterprise_name
            }
            StorageService.put(vm.infoKey, entInfo, 24 * 3 * 60 * 60);
        }
        var storeInfo = StorageService.get(vm.infoKey);
        vm.enterprise_id = storeInfo.enterprise_id;
        vm.enterprise_name = storeInfo.enterprise_name;


        console.log(vm.enterprise_id);
        vm.OperApp = OperApp;
        vm.limit = 10;
        vm.searchItem = '';
        vm.isSearch = false;
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

        vm.enterEvent = function(e){
            var keycode = window.event?e.keyCode:e.which;
            if(keycode==13){
                goSearch();
            }
        }

        function goSearch() {
            console.log(vm.searchItem);
            vm.isSearch = true;
           // http://127.0.0.1:8000/container/api/v1/cloudbox/rentservice/enterprise/enterpriseinfo/userfuzzy
            var param = {
                "keyword":vm.searchItem,
                "enterprise_id":vm.enterprise_id
            }
            NetworkService.post('rentservice/enterprise/enterpriseinfo/userfuzzy?'+'limit='+vm.limit+'&offset='+((vm.pageCurrent - 1) * vm.limit),param,function (response) {
                vm.items = response.data.results;
                vm.displayedCollection = (vm.items);
                //vm.displayedCollection = [].concat(vm.items);
                updatePagination(response.data);
            },function (response) {
                toastr.error(response.statusText);
            });
        };

        function getDatas() {
            if(vm.isSearch){
                vm.goSearch();
            }else {

                NetworkService.get(vm.getBasePath + '/enterprise/' + vm.enterprise_id, {
                    limit: vm.limit,
                    offset: (vm.pageCurrent - 1) * vm.limit
                }, function (response) {
                    vm.items = response.data.results;
                    vm.displayedCollection = (vm.items);
                    //vm.displayedCollection = [].concat(vm.items);
                    updatePagination(response.data);
                }, function (response) {
                    toastr.error(response.statusText);
                });
            }
        }


        function goAddItem() {
            $state.go('app.edit_transportation_company_user',{args:{type:'edit_from_company',enterprise_id:vm.enterprise_id,enterprise_name:vm.enterprise_name}});
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
            vm.pageCurrent = Number(page);
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
