/**
 * Created by Otherplayer on 16/7/25.
 */
(function () {
    'use strict';

    angular
        .module('smart_container')
        .controller('BookingEditController', BookingEditController)
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
    function BookingEditController(NetworkService,StorageService,constdata,i18n,$rootScope,$stateParams,toastr,$timeout) {
        /* jshint validthis: true */
        var vm = this;
        vm.authError = null;
        vm.pageCurrent = 1;
        vm.targetPage = 1;
        vm.pagePreEnabled = false;
        vm.pageNextEnabled = false;
        vm.pages = ['1'];
        vm.totalPages = 1;
        vm.targetPage = 1;
        vm.limit = 8;
        vm.user = {};
        vm.isAdd = true;
        vm.isEdit = false;
        vm.isDetail = false;
        vm.getTenantItem = getTenantItem;
        vm.submitAction = submitAction;
        vm.backAction = backAction;
        vm.back = back;
        vm.addUser = {};
        vm.showEmpty = false;
        vm.showEmptyInfo = '该预约单无预约云箱信息';
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

        vm.showChart = false;
        var type = $stateParams.args.type;
        var username = $stateParams.username;



        vm.refItem = $stateParams.args.data;

        vm.refItemKey = 'booking.efitemkey'
        if(vm.refItem != null){
            StorageService.put(vm.refItemKey,vm.refItem,24 * 7 * 60 * 60);//3 天过期
        }
        vm.refItem = StorageService.get(vm.refItemKey);

        if (username){
            vm.isAdd = false;
        }
        if(type && type=='edit'){
            vm.isEdit = true;
        }
        if(type && type=='detail'){
            vm.isDetail = true;
        }

        vm.containerStatusSpec = {
            1:'可租用',
            2:'运输中',
            3:'不可用'
        };
        vm.reportHistory = [];
        //vm.reqBasePath =  'rentservice/enterprise/enterpriseinfo/addenterpriseinfo/transportasion_company';
        vm.addBasePath =  'rentservice/enterprise/enterpriseinfo/addenterpriseinfo/';
        vm.getBasePath =  'rentservice/boxinfo/detail/';
        vm.updateBasePath =  'rentservice/enterprise/enterpriseinfo/updateenterpriseinfo/';
        vm.delBasePath =  'rentservice/enterprise/enterpriseinfo/';
        vm.getContainerStatPath = 'rentservice/boxinfo/stat/'
        vm.user = [];
        vm.containerReportHistory = [];

        vm.selectedDate = formatDate();

        function formatDate() {
            var d = new Date(),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();

            if (month.length < 2) month = '0' + month;
            if (day.length < 2) day = '0' + day;

            return [year, month].join('-');
        }

        function getDatas(){
            getReportDetailHistory();
        }



        function getTenantItem() {

           // http://106.2.20.185:8000/container/api/v1/cloudbox/rentservice/boxbill/monthbill/dbaac0c6-bea9-11e7-888f-525400d25920
            NetworkService.get('rentservice/appointment/enterprise/'  + username + '/detail',null,function (response) {
                vm.items = response.data;

                console.log(response.data);
            },function (response) {
                toastr.error(response.statusText);
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

        function back() {
            // history.back();
            vm.backAction();
        }




    }

})();