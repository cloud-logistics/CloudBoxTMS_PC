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
        vm.pageCurrent = 1;
        vm.targetPage = 1;
        vm.pagePreEnabled = false;
        vm.pageNextEnabled = false;
        vm.pages = [];
        vm.limit = 10;
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
        vm.getBasePath =  'rentservice/boxinfo/detail/';
        vm.updateBasePath =  'rentservice/enterprise/enterpriseinfo/updateenterpriseinfo/';
        vm.delBasePath =  'rentservice/enterprise/enterpriseinfo/';
        vm.getContainerStatPath = 'rentservice/boxinfo/stat/'

        var map = new BMap.Map("map-div",{minZoom:8,maxZoom:18});          // 创建地图实例
        //map.enableScrollWheelZoom(true);
        //map.enableDragging();

        function getCointainerStat(){

            vm.containerStat = {};
            vm.containerStat.month_count = 0;
            vm.containerStat.month_time = 0;
            vm.containerStat.year_count = 0;
            vm.containerStat.year_time = 0;
            vm.containerStat.week_time = 0;
            vm.containerStat.week_count = 0;

            NetworkService.get(vm.getContainerStatPath  + username,null,function (response) {
             vm.containerStat = response.data;
             },function (response) {
             toastr.error(response.statusText);
             });

        }
        function getDatas(){
            getContainerHistory();
        }
        function getContainerHistory(){


            NetworkService.get('rentservice/boxinfo/leaselist/' + username,{limit:vm.limit, offset:(vm.pageCurrent - 1) * vm.limit},function (response) {
                vm.containerHistory = response.data.results;
                updatePagination(response.data);

            },function (response) {
                toastr.error(response.statusText);
            });



            /*vm.containerHistory = [
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
            ]*/

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
            div.style.backgroundImage = 'url(http://ozv4m1lo0.bkt.clouddn.com/assets/images/box_overlay.svg)';
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
                vm.user = response.data;

                //vm.user = refItem;
                //vm.user.siteinfo = null;
                var disPoint = new BMap.Point(116.404, 39.915);

                if(vm.user.box_info.ava_flag == 'N'){
                    vm.user.curStatus = 3;
                }else if(vm.user.box_info.ava_flag=='Y' && (vm.user.box_info.siteinfo == '' || vm.user.box_info.siteinfo == null)){
                    vm.user.curStatus = 2;
                }else if(vm.user.box_info.ava_flag=='Y' && vm.user.box_info.siteinfo != '' && vm.user.box_info.siteinfo != null ){
                    vm.user.curStatus = 1;
                }

                console.log(vm.user.box_info.siteinfo);
                function showInfo(){
                    var opts = {
                        width: 100,     // 信息窗口宽度
                        height: 80,     // 信息窗口高度
                        title: '',  // 信息窗口标题
                        background: '#122341'
                    };
                    var infoWindow;
                    if(vm.user.box_info.siteinfo != '' && vm.user.box_info.siteinfo != null) {
                        infoWindow = new BMap.InfoWindow('RFID ' + vm.user.box_info.tid + '<br />' + '仓库名称：' + vm.user.box_info.siteinfo.name + '<br />' + '当前位置：' + parseFloat(vm.user.location.longitude).toFixed(2) + ',' + parseFloat(vm.user.location.latitude).toFixed(2) + '<br />', opts);  // 创建信息窗口对象
                    }else{
                         opts = {
                            width: 100,     // 信息窗口宽度
                            height: 50,     // 信息窗口高度
                            title: '',  // 信息窗口标题
                            background: '#122341'
                        };
                        infoWindow = new BMap.InfoWindow('RFID ' + vm.user.box_info.tid + '<br />' + '当前位置：' + parseFloat(vm.user.location.longitude).toFixed(2) + ',' + parseFloat(vm.user.location.latitude).toFixed(2) + '<br />', opts);  // 创建信息窗口对象
                    }
                    infoWindow.addEventListener("close", function () {});
                    map.openInfoWindow(infoWindow, point);
                }

                //if(vm.user.siteinfo != '' && vm.user.siteinfo != null)
                {


                    var point = new BMap.Point(vm.user.location.longitude, vm.user.location.latitude);  // 创建点坐标


                    var mySquare = new SquareOverlay(point, 36, "red");
                    map.addOverlay(mySquare);
                    mySquare.addEventListener("click", showInfo);


                    showInfo();
                    disPoint = new BMap.Point(vm.user.location.longitude, parseFloat(vm.user.location.latitude) + 10);

                }
                map.centerAndZoom(disPoint, 10);


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
            getCointainerStat();
            getContainerHistory();

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