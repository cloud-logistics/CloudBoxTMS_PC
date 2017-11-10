/**
 * Created by Otherplayer on 16/7/25.
 */
(function () {
    'use strict';

    angular
        .module('smart_container')
        .controller('EditTransportationCompanyAdminController', EditTransportationCompanyAdminController)
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
    function EditTransportationCompanyAdminController(NetworkService,StorageService,constdata,i18n,$rootScope,$stateParams,toastr) {
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
        vm.userGroup = [
            {
                title:'超级管理员',
                value:'admin'
            },
            {
                title:'企业管理员',
                value:'rentadmin'
            },
            {
                title:'企业用户',
                value:'rentuser'
            }
        ];

        vm.userRole = [
            {
                title:'管理员',
                value:'admin'
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
            'admin':'管理员',
            'user':'用户'
        };
        vm.labelGroupContent={
            'admin':'超级管理员',
            'rentadmin':'企业管理员',
            'rentuser':'企业用户'
        };
        //vm.showSpinner = false;
        var type = $stateParams.args.type;
        var username = $stateParams.username;
        if (username){
            vm.isAdd = false;
        }
        if(type && type=='edit'){
            vm.isEdit = true;
        }
        if(type && type=='detail'){
            vm.isDetail = true;
        }

        //vm.reqBasePath =  'rentservice/enterprise/enterpriseinfo/addenterpriseinfo/transportasion_company';
        vm.addBasePath =  'rentservice/enterpriseuser/addenterpriseuser/';
        vm.getBasePath =  'rentservice/enterpriseuser/detail/';
        vm.updateBasePath =  'rentservice/enterpriseuser/updateenterpriseuser/';
        vm.delBasePath =  'rentservice/enterpriseuser/';

        vm.getBaseCompanyPath =  'rentservice/enterprise/enterpriseinfo/list';

        function getCompanyDatas() {

            NetworkService.get(vm.getBaseCompanyPath,{limit:100, offset:0},function (response) {
                vm.companyInfo = response.data.results;
                //if(vm.isAdd && vm.companyInfo.length > 0){
                  //  vm.user.enterprise_id = vm.companyInfo[0].enterprise_id;
                //}
            },function (response) {
                toastr.error(response.status + ' ' + response.statusText);
            });
        }
        getCompanyDatas();

        vm.uploadFile = function (){
            vm.showSpinner = true;
            NetworkService.putFile(vm.myUploadFile.name,vm.myUploadFile,function (response) {
                toastr.success('上传成功！');
                vm.showSpinner = false;
                console.log(response);
                vm.user.avatar_url = 'http://'+response.data.data.url;
            },function (response) {
                toastr.error(response.status + ' ' + response.statusText);
                vm.showSpinner = false;
            });
        };
        function getTenantItem() {
            NetworkService.get(vm.getBasePath + '/' + username + '/',null,function (response) {
                vm.user = response.data;
                vm.user.enterprise_id = vm.user.enterprise;
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



        if (!vm.isAdd){
            vm.getTenantItem();
        }
        if(vm.isAdd){
            vm.user.role='admin';
            vm.user.group = 'rentadmin';
        }
        function back() {
            // history.back();
            vm.backAction();
        }

    }

})();