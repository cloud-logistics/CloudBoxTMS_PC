/**
 * Created by Otherplayer on 16/7/25.
 */
(function () {
    'use strict';

    angular
        .module('smart_container')
        .controller('ConfigController', ConfigController)
        .filter('userType',function(i18n) {
        return function(input) {
            var out = '';
            if(input=='admin') {
                out = i18n.t('profile.ADMIN')
            } else if(input=='tenant') {
                out = i18n.t('profile.TENANT')
            }
            return out;
        }
    });

    /** @ngInject */
    function ConfigController(NetworkService,StorageService,constdata,i18n,$rootScope,$stateParams,toastr) {
        /* jshint validthis: true */
        var vm = this;
        vm.authError = null;
        vm.user = {};
        vm.isAdd = true;
        vm.isEdit = false;
        vm.isDetail = false;
        vm.getTenantItem = getTenantItem;
        vm.submitAction = submitAction;
        vm.backAction = backAction;
        vm.back = back;
        vm.addUser = {};
        vm.userType = [
            {
                title:'管理员',
                value:'admin'
            },
            {
                title:'商户',
                value:'tenant'
            },
            {
                title:'用户',
                value:'user'
            }
        ];

        vm.statusType = [
            {
                title:'已启用',
                value:'enabled'
            },
            {
                title:'已禁用',
                value:'disabled'
            }
        ];



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


        vm.tabItem =
            [{
                title:'云箱费用',
                active:true,
                id:1

            }
            ];


        vm.containerItems = [

        ];


        vm.warehouseHistory = [];
        vm.sel = function(oper){
            for(var i = 0; i < vm.tabItem.length; i ++){
                if(vm.tabItem[i].id == oper){
                    vm.tabItem[i].active = true;
                }else{
                    vm.tabItem[i].active = false;
                }
            }
        };


        vm.edit = function(item){
            if(item.editTitle == '编辑') {
                item.isEdit = true;
                item.editTitle = '保存';
            }else{
                var param = {
                    type_id:item.id,
                    fee_per_hour:item.price
                };
                NetworkService.post('rentservice/boxrentservice/boxtypefee',param,function (response) {
                    toastr.success('保存成功！');
                    vm.getTenantItem();
                },function (response) {
                    toastr.error(response.status + ' ' + response.statusText);
                });
            }
        };
        vm.cancel = function(item){
            item.isEdit = false;
            item.editTitle = '编辑';
        }
        vm.sel(1);


        vm.uploadFile = function (){
            console.log(vm.myUploadFile);
            vm.showSpinner = true;
            NetworkService.postForm(constdata.api.uploadFile.qiniuPath,vm.myUploadFile,function (response) {
                toastr.success('上传成功！');
                vm.showSpinner = false;
                vm.user.avatar = response.data.url;
            },function (response) {
                toastr.error(response.status + ' ' + response.statusText);
                vm.showSpinner = false;
            });
        }





        function getTenantItem() {
            NetworkService.get('rentservice/boxrentservice/boxtypeinfo',null,function (response) {
                vm.user = response.data;
                if(vm.user != null && vm.user.length > 0) {
                    for (var i = 0; i < vm.user.length; i++) {
                        vm.user[i].isEdit = false;
                        vm.user[i].editTitle = '编辑';
                    }
                }
                vm.containerItems = vm.user;
                console.log(vm.containerItems);

            },function (response) {
                toastr.error(response.status + ' ' + response.statusText);
            });
        }


        function addItem() {
            NetworkService.post(vm.addBasePath,vm.user,function (response) {
                toastr.success('添加成功！');
                vm.backAction();
            },function (response) {
                console.log(response);
                toastr.error(response.status + ' ' + response.statusText);
            });
        }

        function editItem() {
            NetworkService.post(vm.updateBasePath,vm.user,function (response) {
                toastr.success('操作成功！');
                vm.backAction();
            },function (response) {
                toastr.error(response.status + ' ' + response.statusText);
            });
        }
        function submitAction() {
            if (vm.isAdd){
                addItem();
            }else{
                editItem();
            }
        }


        function backAction() {
            // $state.go('app.tenant');
            $rootScope.backPre();
        }

        vm.getTenantItem();

        function back() {
            // history.back();
            vm.backAction();
        }

    }

})();