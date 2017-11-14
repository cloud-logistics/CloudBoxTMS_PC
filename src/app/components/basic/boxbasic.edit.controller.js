/**
 * Created by Otherplayer on 16/7/25.
 */
(function () {
    'use strict';

    angular
        .module('smart_container')
        .controller('BoxBasicEditController', BoxBasicEditController)
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
    function BoxBasicEditController(NetworkService,StorageService,constdata,i18n,$rootScope,$stateParams,toastr) {
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

        var type = $stateParams.args.type;
        var username = $stateParams.username;
        var refItem = $stateParams.args.data;
        console.log(refItem)
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
        vm.tabItem =
            [{
                title:'仓库详情',
                active:true,
                id:1

            }, {
                title:'历史明细',
                active:false,
                id:2
            }

            ];

        vm.warehouseHistory = [];




        //vm.reqBasePath =  'rentservice/enterprise/enterpriseinfo/addenterpriseinfo/transportasion_company';
        vm.addBasePath =  'rentservice/enterprise/enterpriseinfo/addenterpriseinfo/';
        vm.getBasePath =  'rentservice/site/detail';
        vm.updateBasePath =  'rentservice/enterprise/enterpriseinfo/updateenterpriseinfo/';
        vm.delBasePath =  'rentservice/enterprise/enterpriseinfo/';

        var map = new BMap.Map("map-div",{minZoom:8,maxZoom:8});          // 创建地图实例

        function getWarehouseHistory(){

            /*NetworkService.get(vm.getBasePath + '/' + username,null,function (response) {
                vm.user = response.data.site_info;

            },function (response) {
                toastr.error(response.status + ' ' + response.statusText);
            });*/
            vm.containerHistory = [
                {
                    startDate:'2017-11-06 11:30',
                    endDate:'2017-11-07 15:30',
                    user:'海航货运集团',
                    departure:'陕西西安099仓库',
                    arrival:'海口023仓库',
                },
                {
                    startDate:'2017-11-03 11:30',
                    endDate:'2017-11-04 15:30',
                    user:'大货运集团',
                    departure:'上海011仓库',
                    arrival:'北京003仓库',
                },
                {
                    startDate:'2017-11-06 11:30',
                    endDate:'2017-11-07 15:30',
                    user:'海航货运集团',
                    departure:'陕西西安099仓库',
                    arrival:'海口023仓库',
                },
                {
                    startDate:'2017-11-03 11:30',
                    endDate:'2017-11-04 15:30',
                    user:'大货运集团',
                    departure:'上海011仓库',
                    arrival:'北京003仓库',
                },{
                    startDate:'2017-11-06 11:30',
                    endDate:'2017-11-07 15:30',
                    user:'海航货运集团',
                    departure:'陕西西安099仓库',
                    arrival:'海口023仓库',
                },
                {
                    startDate:'2017-11-03 11:30',
                    endDate:'2017-11-04 15:30',
                    user:'大货运集团',
                    departure:'上海011仓库',
                    arrival:'北京003仓库',
                }
            ]

        };

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
           // NetworkService.get(vm.getBasePath + '/' + username,null,function (response) {
                //vm.user = response.data.site_info;

                vm.user = refItem;


                if(vm.user.ava_flag == 'N'){
                    vm.user.curStatus = 3;
                }else if(vm.user.ava_flag=='Y' && (vm.user.siteinfo == '' || vm.user.siteinfo == null)){
                    vm.user.curStatus = 2;
                }else if(vm.user.ava_flag=='Y' && vm.user.siteinfo != '' && vm.user.siteinfo != null ){
                    vm.user.curStatus = 1;
                }

                var point = new BMap.Point(vm.user.siteinfo.longitude, vm.user.siteinfo.latitude);  // 创建点坐标
                var marker = new BMap.Marker(point);        // 创建标注
                map.addOverlay(marker);

                //map.enableScrollWheelZoom(false);     //开启鼠标滚轮缩放

                var opts = {
                    width : 100,     // 信息窗口宽度
                    height: 50,     // 信息窗口高度
                    title : '',  // 信息窗口标题
                    background:'#122341'
                };

                var infoWindow = new BMap.InfoWindow('RFID '+ vm.user.tid+'<br />'+ '使用人 ' + '大货运公司' + '<br />' + '当前位置：'+vm.user.siteinfo.location + '<br />', opts);  // 创建信息窗口对象
                map.openInfoWindow(infoWindow, point);

                var disPoint  = new BMap.Point(vm.user.siteinfo.longitude, parseFloat(vm.user.siteinfo.latitude) + 10);
                console.log(vm.user.siteinfo.latitude);
                //console.log(parseFloat(vm.user.latitude)+5);
                map.centerAndZoom(disPoint, 10);



           /* },function (response) {
                toastr.error(response.status + ' ' + response.statusText);
            });*/
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
            getWarehouseHistory();
        }

        function back() {
            // history.back();
            vm.backAction();
        }

    }

})();