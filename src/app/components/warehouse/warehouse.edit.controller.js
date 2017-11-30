/**
 * Created by Otherplayer on 16/7/25.
 */
(function () {
    'use strict';

    angular
        .module('smart_container')
        .controller('EditWarehouseController', EditWarehouseController)
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
    function EditWarehouseController(NetworkService,StorageService,constdata,i18n,$rootScope,$stateParams,toastr) {
        /* jshint validthis: true */
        var vm = this;
        vm.authError = null;
        vm.user = {};
        vm.isAdd = true;
        vm.isEdit = false;
        vm.isDetail = false;
        vm.pageCurrent = 1;
        vm.targetPage = 1;
        vm.pagePreEnabled = false;
        vm.pageNextEnabled = false;
        vm.pages = [];
        vm.limit = 10;
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




        //vm.reqBasePath =  'rentservice/enterprise/enterpriseinfo/addenterpriseinfo/transportasion_company';
        vm.addBasePath =  'rentservice/enterprise/enterpriseinfo/addenterpriseinfo/';
        vm.getBasePath =  'rentservice/site/detail';
        vm.updateBasePath =  'rentservice/enterprise/enterpriseinfo/updateenterpriseinfo/';
        vm.delBasePath =  'rentservice/enterprise/enterpriseinfo/';
        vm.getWarehouseHisPath = 'rentservice/site/stat/';
        var map = new BMap.Map("map-div",{minZoom:8,maxZoom:8});          // 创建地图实例

        function getDatas(){
            getWarehouseHistory();
        }
        function getWarehouseHistory(){

            NetworkService.get(vm.getWarehouseHisPath + '/' + username,{limit:vm.limit, offset:(vm.pageCurrent - 1) * vm.limit},function (response) {
                vm.userHis = response.data.results;
                //console.log(vm.userHis);
                vm.warehouseHistory = [];
                if(vm.userHis != null && vm.userHis.length > 0){
                    for(var i = 0; i < vm.userHis.length; i ++){
                        vm.warehouseHistory[i] = {};
                        vm.warehouseHistory[i].date = vm.userHis[i].stat_day;
                        vm.warehouseHistory[i].inputAll = vm.userHis[i].total_in;
                        vm.warehouseHistory[i].outputAll = vm.userHis[i].total_out;

                        vm.warehouseHistory[i].inputFreezer = 0;
                        vm.warehouseHistory[i].outputFreezer = 0;
                        vm.warehouseHistory[i].inputCooler = 0;
                        vm.warehouseHistory[i].outputCooler = 0;
                        vm.warehouseHistory[i].inputMedical = 0;
                        vm.warehouseHistory[i].outputMedical = 0;
                        vm.warehouseHistory[i].inputOrdinary = 0;
                        vm.warehouseHistory[i].outputOrdinary = 0;
                        vm.warehouseHistory[i].inputSpecial = 0;
                        vm.warehouseHistory[i].outputSpecial = 0;



                        if(vm.userHis[i].detail && vm.userHis[i].detail.length > 0){
                            for (var j = 0;  j < vm.userHis[i].detail.length; j ++){
                                if(vm.userHis[i].detail[j].box_type.id == 1){
                                    vm.warehouseHistory[i].inputFreezer = vm.userHis[i].detail[j].box_in;
                                    vm.warehouseHistory[i].outputFreezer = vm.userHis[i].detail[j].box_out;
                                }else if(vm.userHis[i].detail[j].box_type.id == 2){
                                    vm.warehouseHistory[i].inputCooler = vm.userHis[i].detail[j].box_in;
                                    vm.warehouseHistory[i].outputCooler = vm.userHis[i].detail[j].box_out;
                                }else if(vm.userHis[i].detail[j].box_type.id == 3){
                                    vm.warehouseHistory[i].inputMedical = vm.userHis[i].detail[j].box_in;
                                    vm.warehouseHistory[i].outputMedical = vm.userHis[i].detail[j].box_out;
                                }else if(vm.userHis[i].detail[j].box_type.id == 4){
                                    vm.warehouseHistory[i].inputOrdinary = vm.userHis[i].detail[j].box_in;
                                    vm.warehouseHistory[i].outputOrdinary = vm.userHis[i].detail[j].box_out;
                                }else if(vm.userHis[i].detail[j].box_type.id == 5){
                                    vm.warehouseHistory[i].inputSpecial = vm.userHis[i].detail[j].box_in;
                                    vm.warehouseHistory[i].outputSpecial = vm.userHis[i].detail[j].box_out;
                                }
                            }
                        }


                    }
                }
                updatePagination(response.data);

            },function (response) {
                toastr.error(response.statusText);
            });

        };

        vm.uploadFile = function (){
            console.log(vm.myUploadFile);
            vm.showSpinner = true;
            NetworkService.postForm(constdata.api.uploadFile.qiniuPath,vm.myUploadFile,function (response) {
                toastr.success('上传成功！');
                vm.showSpinner = false;
                vm.user.avatar = response.data.url;
            },function (response) {
                toastr.error(response.statusText);
                vm.showSpinner = false;
            });
        }





        function SquareOverlay(center, length, color){
            this._center = center;
            this._length = length;
            this._color = color;
        }
// 继承API的BMap.Overlay
        SquareOverlay.prototype = new BMap.Overlay();


        SquareOverlay.prototype.initialize = function(map){
            // 保存map对象实例
            this._map = map;
            // 创建div元素，作为自定义覆盖物的容器
            var div = document.createElement("div");
            div.style.position = "absolute";
            // 可以根据参数设置元素外观
            div.style.width = this._length + "px";
            div.style.height = this._length + "px";
            div.style.backgroundImage = 'url(http://ozv4m1lo0.bkt.clouddn.com/assets/images/icon_warehouse_bd.svg)';
            div.style.backgroundSize='cover';
            // 将div添加到覆盖物容器中
            map.getPanes().markerPane.appendChild(div);
            // 保存div实例
            this._div = div;
            // 需要将div元素作为方法的返回值，当调用该覆盖物的show、
            // hide方法，或者对覆盖物进行移除时，API都将操作此元素。
            return div;
        }


        // 实现绘制方法
        SquareOverlay.prototype.draw = function(){
// 根据地理坐标转换为像素坐标，并设置给容器
            var position = this._map.pointToOverlayPixel(this._center);
            this._div.style.left = position.x - this._length / 2 + "px";
            this._div.style.top = position.y - this._length / 2 + "px";
        }


        // 实现显示方法
        SquareOverlay.prototype.show = function(){
            if (this._div){
                this._div.style.display = "";
            }
        }
// 实现隐藏方法
        SquareOverlay.prototype.hide = function(){
            if (this._div){
                this._div.style.display = "none";
            }
        }


        SquareOverlay.prototype.addEventListener = function(event,fun){
            console.log(this._div);
            this._div['on'+event] = fun;
        }


        function getTenantItem() {
            NetworkService.get(vm.getBasePath + '/' + username,null,function (response) {
                vm.user = response.data.site_info;
                var point = new BMap.Point(vm.user.longitude, vm.user.latitude);  // 创建点坐标
                /*var marker = new BMap.Marker(point);        // 创建标注
                marker.addEventListener("click", function(){
                    showInfo();
                });
                map.addOverlay(marker);*/

                var mySquare = new SquareOverlay(point, 59, "red");
                map.addOverlay(mySquare);
                mySquare.addEventListener("click", showInfo);



                var disPoint = new BMap.Point(vm.user.longitude, parseFloat(vm.user.latitude) + 10);
                map.centerAndZoom(disPoint, 10);

                function showInfo() {
                    var opts = {
                        width: 100,     // 信息窗口宽度
                        height: 50,     // 信息窗口高度
                        title: ''  // 信息窗口标题
                    };


                    var lat = vm.user.latitude > 0 ? '北纬' : '南纬';


                    var posStr = (vm.user.latitude >= 0 ? '北纬':'南纬') + parseFloat(vm.user.latitude).toFixed(2)  + '/'+(vm.user.longitude >= 0 ? '东经':'西经') + parseFloat(vm.user.longitude).toFixed(2);
                    var infoWindow = new BMap.InfoWindow('地址：' + vm.user.location + '<br />' + '坐标：'+posStr, opts);  // 创建信息窗口对象
                    infoWindow.addEventListener("close", function () {
                    });
                    map.openInfoWindow(infoWindow, point);

                };
                showInfo();

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
                vm.user.specialBoxInfo = {
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
                            vm.user.freezerBoxInfo.allNum = vm.allInfo.box_counts[j].ava_num;
                            vm.user.freezerBoxInfo.availableNum = vm.allInfo.box_counts[j].ava_num - vm.allInfo.box_counts[j].reserve_num;
                        } else if (vm.allInfo.box_counts[j].box_type.id == 2) {
                            vm.user.coolerBoxInfo.allNum = vm.allInfo.box_counts[j].ava_num;
                            vm.user.coolerBoxInfo.availableNum = vm.allInfo.box_counts[j].ava_num - vm.allInfo.box_counts[j].reserve_num;

                        } else if (vm.allInfo.box_counts[j].box_type.id == 3) {
                            vm.user.medicalBoxInfo.allNum = vm.allInfo.box_counts[j].ava_num;
                            vm.user.medicalBoxInfo.availableNum = vm.allInfo.box_counts[j].ava_num - vm.allInfo.box_counts[j].reserve_num;

                        } else if (vm.allInfo.box_counts[j].box_type.id == 4) {
                            vm.user.ordinaryBoxInfo.allNum = vm.allInfo.box_counts[j].ava_num;
                            vm.user.ordinaryBoxInfo.availableNum = vm.allInfo.box_counts[j].ava_num - vm.allInfo.box_counts[j].reserve_num;
                        } else if (vm.allInfo.box_counts[j].box_type.id == 5) {
                            vm.user.specialBoxInfo.allNum = vm.allInfo.box_counts[j].ava_num;
                            vm.user.specialBoxInfo.availableNum = vm.allInfo.box_counts[j].ava_num - vm.allInfo.box_counts[j].reserve_num;
                        }
                    }
                }
                vm.user.allCurrentBoxInfo.allNum = vm.user.freezerBoxInfo.allNum +  vm.user.coolerBoxInfo.allNum
                    + vm.user.medicalBoxInfo.allNum + vm.user.ordinaryBoxInfo.allNum+ vm.user.specialBoxInfo.allNum;
                vm.user.allCurrentBoxInfo.availableNum = vm.user.freezerBoxInfo.availableNum +  vm.user.coolerBoxInfo.availableNum
                    + vm.user.medicalBoxInfo.availableNum + vm.user.ordinaryBoxInfo.availableNum+ vm.user.specialBoxInfo.availableNum;

                //console.log(vm.user);


            },function (response) {
                toastr.error(response.statusText);
            });
        }


        function addItem() {
            NetworkService.post(vm.addBasePath,vm.user,function (response) {
                toastr.success('添加成功！');
                vm.backAction();
            },function (response) {
                console.log(response);
                toastr.error(response.statusText);
            });
        }

        function editItem() {
            NetworkService.post(vm.updateBasePath,vm.user,function (response) {
                toastr.success('操作成功！');
                vm.backAction();
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
            getWarehouseHistory();
        }

        function back() {
            // history.back();
            vm.backAction();
        }






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

    }

})();