/**
 * Created by Otherplayer on 16/7/21.
 */
(function () {
    'use strict';

    angular.module('smart_container').controller('ProfileController', ProfileController);

    /** @ngInject */
    function ProfileController($scope,ApiServer,toastr,constdata,$state,NetworkService, StorageService) {
        /* jshint validthis: true */
        var vm = this;
        vm.submitAction = submitAction;
        vm.cancelAction = cancelAction;


        vm.addBasePath =  'rentservice/enterpriseuser/addenterpriseuser/';
        vm.getBasePath =  'rentservice/enterpriseuser/detail/';
        vm.updateBasePath =  'rentservice/enterpriseuser/updateenterpriseuser/';
        vm.delBasePath =  'rentservice/enterpriseuser/';


        vm.getBaseCompanyPath =  'rentservice/enterprise/enterpriseinfo/list';
        var userInfo = StorageService.get(constdata.informationKey);
        console.log(userInfo);


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


        function editItem() {
            NetworkService.post(vm.updateBasePath,vm.user,function (response) {
                toastr.success('操作成功！');
                vm.backAction();
            },function (response) {
                toastr.error(response.status + ' ' + response.statusText);
            });
        }
        function submitAction() {
            editItem();
        }
        function cancelAction() {
            $state.go('app.dashboard');
        }


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



        function getDatas() {
            NetworkService.get(vm.getBasePath + '/' + userInfo.userId + '/',null,function (response) {
                vm.user = response.data;
                vm.user.enterprise_id = vm.user.enterprise;
            },function (response) {
                toastr.error(response.status + ' ' + response.statusText);
            });
        }

        getDatas();


    }

})();
