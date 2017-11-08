/**
 * Created by Otherplayer on 16/7/25.
 */
(function () {
    'use strict';

    angular
        .module('smart_container')
        .controller('EditWarehouseControllerbk', EditWarehouseControllerbk)
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
    function EditWarehouseControllerbk(NetworkService,StorageService,constdata,i18n,$rootScope,$stateParams,toastr) {
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
        if (username){
            vm.isAdd = false;
        }
        if(type && type=='edit'){
            vm.isEdit = true;
        }
        if(type && type=='detail'){
            vm.isDetail = true;
        }


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
        vm.sel = function(oper){
            for(var i = 0; i < vm.tabItem.length; i ++){
                if(vm.tabItem[i].id == oper){
                    vm.tabItem[i].active = true;
                }else{
                    vm.tabItem[i].active = false;
                }
            }

            /*if(oper == 1){
                getPlatMgr();
            }else if(oper == 2){
                getPointBasic();
                getPointRule();
            }else if(oper == 3){
                getQuickFlightRule();
            }*/

            if(oper == 2){
                getWarehouseHistory();
            }



        };



        vm.sel(1);
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
            vm.warehouseHistory = [
                {
                    date:'2017-11-06',
                    inputAll:5,
                    outputAll:3,
                    inputFreezer:5,
                    outputFreezer:3,
                    inputCooler:5,
                    outputCooler:3,
                    inputMedical:5,
                    outputMedical:3,
                    inputOrdinary:5,
                    outputOrdinary:3
                },
                {
                    date:'2017-11-05',
                    inputAll:5,
                    outputAll:3,
                    inputFreezer:5,
                    outputFreezer:3,
                    inputCooler:5,
                    outputCooler:3,
                    inputMedical:5,
                    outputMedical:3,
                    inputOrdinary:5,
                    outputOrdinary:3
                },
                {
                    date:'2017-11-04',
                    inputAll:5,
                    outputAll:3,
                    inputFreezer:5,
                    outputFreezer:3,
                    inputCooler:5,
                    outputCooler:3,
                    inputMedical:5,
                    outputMedical:3,
                    inputOrdinary:5,
                    outputOrdinary:3
                },
                {
                    date:'2017-11-03',
                    inputAll:15,
                    outputAll:13,
                    inputFreezer:5,
                    outputFreezer:3,
                    inputCooler:5,
                    outputCooler:3,
                    inputMedical:5,
                    outputMedical:3,
                    inputOrdinary:5,
                    outputOrdinary:3
                },
                {
                    date:'2017-11-02',
                    inputAll:15,
                    outputAll:13,
                    inputFreezer:5,
                    outputFreezer:3,
                    inputCooler:5,
                    outputCooler:3,
                    inputMedical:5,
                    outputMedical:3,
                    inputOrdinary:5,
                    outputOrdinary:3
                },
                {
                    date:'2017-11-01',
                    inputAll:15,
                    outputAll:13,
                    inputFreezer:5,
                    outputFreezer:3,
                    inputCooler:5,
                    outputCooler:3,
                    inputMedical:5,
                    outputMedical:3,
                    inputOrdinary:5,
                    outputOrdinary:3
                },
                {
                    date:'2017-10-30',
                    inputAll:15,
                    outputAll:13,
                    inputFreezer:5,
                    outputFreezer:3,
                    inputCooler:5,
                    outputCooler:3,
                    inputMedical:5,
                    outputMedical:3,
                    inputOrdinary:5,
                    outputOrdinary:3
                }



            ]

        }

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
            NetworkService.get(vm.getBasePath + '/' + username,null,function (response) {
                vm.user = response.data.site_info;


                var point = new BMap.Point(vm.user.longitude, vm.user.latitude);  // 创建点坐标
                var marker = new BMap.Marker(point);        // 创建标注

                marker.addEventListener("click", function(){
                    //alert("您点击了标注");
                    var opts = {
                        width : 150,     // 信息窗口宽度
                        height: 70,     // 信息窗口高度
                        title : '仓库信息:'  // 信息窗口标题
                    }
                    var infoWindow = new BMap.InfoWindow(vm.user.location+'\n' + '('+vm.user.longitude+','+vm.user.latitude+')', opts);  // 创建信息窗口对象
                    map.openInfoWindow(infoWindow, point);      // 打开信息窗口
                });

                map.addOverlay(marker);
                map.centerAndZoom(point, 10);
                map.enableScrollWheelZoom(false);     //开启鼠标滚轮缩放




                vm.allInfo = response.data;

                vm.user.freezerBoxInfo  = {
                    "availableNum":0,
                    "allNum":0
                };
                vm.user.coolerBoxInfo = {
                    "availableNum":0,
                        "allNum":0
                };
                vm.user.medicalBoxInfo = {
                    "availableNum":0,
                        "allNum":0
                };
                vm.user.ordinaryBoxInfo = {
                    "availableNum":0,
                        "allNum":0
                };
                vm.user.allCurrentBoxInfo = {
                    "availableNum":0,
                        "allNum":0
                };

                vm.user.freezerBoxInfo.availableNum = 0;
                vm.user.freezerBoxInfo.allNum = 0;
                vm.user.coolerBoxInfo.availableNum = 0;
                vm.user.coolerBoxInfo.allNum = 0;
                vm.user.medicalBoxInfo.availableNum = 0;
                vm.user.medicalBoxInfo.allNum = 0;
                vm.user.ordinaryBoxInfo.availableNum = 0;
                vm.user.ordinaryBoxInfo.allNum = 0;
                vm.user.allCurrentBoxInfo.availableNum = 0;
                vm.user.allCurrentBoxInfo.allNum = 0;


                //console.log(vm.allInfo.box_counts);
                if(vm.allInfo.box_counts && vm.allInfo.box_counts.length > 0) {
                    for (var j = 0; j < vm.allInfo.box_counts.length; j++) {
                        if (vm.allInfo.box_counts[j].box_type.id == 1) {
                            vm.user.freezerBoxInfo.allNum = vm.allInfo.box_counts[j].ava_num + vm.allInfo.box_counts[j].reserve_num;
                            vm.user.freezerBoxInfo.availableNum = vm.allInfo.box_counts[j].ava_num;
                        } else if (vm.allInfo.box_counts[j].box_type.id == 2) {
                            vm.user.coolerBoxInfo.allNum = vm.allInfo.box_counts[j].ava_num + vm.allInfo.box_counts[j].reserve_num;
                            vm.user.coolerBoxInfo.availableNum = vm.allInfo.box_counts[j].ava_num;

                        } else if (vm.allInfo.box_counts[j].box_type.id == 3) {
                            vm.user.medicalBoxInfo.allNum = vm.allInfo.box_counts[j].ava_num + vm.allInfo.box_counts[j].reserve_num;
                            vm.user.medicalBoxInfo.availableNum = vm.allInfo.box_counts[j].ava_num;

                        } else if (vm.allInfo.box_counts[j].box_type.id == 4) {
                            vm.user.ordinaryBoxInfo.allNum = vm.allInfo.box_counts[j].ava_num + vm.allInfo.box_counts[j].reserve_num;
                            vm.user.ordinaryBoxInfo.availableNum = vm.allInfo.box_counts[j].ava_num;
                        }
                    }
                }
                vm.user.allCurrentBoxInfo.allNum = vm.user.freezerBoxInfo.allNum +  vm.user.coolerBoxInfo.allNum
                    + vm.user.medicalBoxInfo.allNum + vm.user.ordinaryBoxInfo.allNum;
                vm.user.allCurrentBoxInfo.availableNum = vm.user.freezerBoxInfo.availableNum +  vm.user.coolerBoxInfo.availableNum
                    + vm.user.medicalBoxInfo.availableNum + vm.user.ordinaryBoxInfo.availableNum;

                //console.log(vm.user);


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

        function back() {
            // history.back();
            vm.backAction();
        }

    }

})();