/**
 * Created by Otherplayer on 16/7/25.
 */
(function () {
    'use strict';

    angular
        .module('smart_container')
        .controller('ReportEditController', ReportEditController)
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
    function ReportEditController(NetworkService,StorageService,constdata,i18n,$rootScope,$stateParams,toastr) {
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
        vm.refItem = $stateParams.args.data;

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

        var map = new BMap.Map("map-div",{minZoom:8,maxZoom:8});          // 创建地图实例


        function getDatas(){
            getReportDetailHistory();
        }

        function getReportDetailHistory()
        {

        }

        vm.onChartClick = function(param){
            console.log(param);
            console.log(param.name);

        }
        function getTenantItem() {
            /*NetworkService.get(vm.getBasePath + '/' + username,null,function (response) {
                vm.user = response.data;

            },function (response) {
                toastr.error(response.status + ' ' + response.statusText);
            });*/


            vm.user = [
                {
                    time:'2017-01',
                    usedContainer:32,
                    amount:2323.32,
                },
                {
                    time:'2017-02',
                    usedContainer:93,
                    amount:8326.79,
                },
                {
                    time:'2017-03',
                    usedContainer:123,
                    amount:12323.32,
                },
                {
                    time:'2017-04',
                    usedContainer:45,
                    amount:5326.79,
                },
                {
                    time:'2017-05',
                    usedContainer:82,
                    amount:4223.32,
                },
                {
                    time:'2017-06',
                    usedContainer:93,
                    amount:14326.79,
                },
                {
                    time:'2017-07',
                    usedContainer:523,
                    amount:25555.32,
                },
                {
                    time:'2017-08',
                    usedContainer:322,
                    amount:4326.79,
                },
                {
                    time:'2017-09',
                    usedContainer:243,
                    amount:1323.32,
                },
                {
                    time:'2017-10',
                    usedContainer:221,
                    amount:10326.79,
                },
                {
                    time:'2017-11',
                    usedContainer:150,
                    amount:4326.79,
                }


            ];
            vm.selectedMonth = 11;


            var containerNum = [];
            var amount = [];
            var month = [];
            for(var i = 0; i < vm.user.length; i ++){

                containerNum.push(vm.user[i].usedContainer);
                amount.push(vm.user[i].amount);
                month.push(vm.user[i].time);
            }

            console.log(containerNum);
            console.log(amount);
            console.log(month);
            vm.reportOption = {
                title : {
                    text : '历史记录',
                    textStyle:{//标题内容的样式
                        color:'#4668E7',//京东红
                        fontStyle:'normal',//主标题文字字体风格，默认normal，有italic(斜体),oblique(斜体)
                        fontWeight:"bold",//可选normal(正常)，bold(加粗)，bolder(加粗)，lighter(变细)，100|200|300|400|500...
                        fontFamily:"PingFangSC-Medium",//主题文字字体，默认微软雅黑
                        fontSize:24//主题文字字体大小，默认为18px
                    },
                    textAlign:'left',//标题文本水平对齐方式，建议不要设置，就让他默认，想居中显示的话，建议往下看
                    textBaseline:"top",//默认就好,垂直对齐方式,不要设置
                    left:100
                },

                event: [
                    {click:vm.onChart}
                    ],
                tooltip : {
                    trigger : 'axis',
                    showDelay : 0, // 显示延迟，添加显示延迟可以避免频繁切换，单位ms
                    axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                        type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                legend: {
                    x: 'left',               // 水平安放位置，默认为全图居中，可选为：
                    y: 'bottom',
                    data:['该月归还数', '该月金额'],
                    left:100
                },
                xAxis : [{
                    type : 'category',
                    data : month,
                    axisLabel:{
                        textStyle:{
                            color:"#222"
                        }
                    }
                }],
                yAxis : [{
                    type : 'value'
                },
                    {
                        type : 'value',
                        //show: false
                        splitLine:{
                            show:false
                        }
                    }],
                series : [
                    {
                        yAxisIndex:0,
                        name:'该月归还数',
                        type:'line',
                        itemStyle : { normal: {color:'#b6a2de'}},
                        data:containerNum
                    },
                    {
                        yAxisIndex:1,
                        name:'该月金额',
                        type:'bar',
                        itemStyle : { normal: {color:'#2ec7c9'}},
                        data:amount
                    }
                ]
            };

            //vm.reportOption = option;

            console.log(vm.reportOption);


            vm.containerReportHistory = [
                {
                    containerId:'HNA123223112',
                    type:'冷链箱',
                    startTime:'2017-10-11 11:30',
                    endTime:'2017-10-13 21:20',
                    amount:1232
                },
                {
                    containerId:'HNA322123',
                    type:'冷藏箱',
                    startTime:'2017-10-09 03:10',
                    endTime:'2017-10-110 09:50',
                    amount:32232.5
                },
                {
                    containerId:'HNA123223112',
                    type:'冷链箱',
                    startTime:'2017-10-11 11:30',
                    endTime:'2017-10-13 21:20',
                    amount:1232
                },
                {
                    containerId:'HNA322123',
                    type:'冷藏箱',
                    startTime:'2017-10-09 03:10',
                    endTime:'2017-10-110 09:50',
                    amount:32232.5
                },

                {
                    containerId:'HNA123223112',
                    type:'冷链箱',
                    startTime:'2017-10-11 11:30',
                    endTime:'2017-10-13 21:20',
                    amount:1232
                },
                {
                    containerId:'HNA322123',
                    type:'冷藏箱',
                    startTime:'2017-10-09 03:10',
                    endTime:'2017-10-110 09:50',
                    amount:32232.5
                }


            ];


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
            console.log(page);
            vm.pageCurrent = Number(page);
            console.log(vm.pageCurrent);
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

        }

    }

})();