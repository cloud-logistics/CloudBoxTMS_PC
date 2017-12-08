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
    function ReportEditController(NetworkService,StorageService,constdata,i18n,$rootScope,$stateParams,toastr,$timeout) {
        /* jshint validthis: true */
        var vm = this;
        vm.authError = null;
        vm.pageCurrent = 1;
        vm.targetPage = 1;
        vm.pagePreEnabled = false;
        vm.pageNextEnabled = false;
        vm.pages = ['1'];
        vm.totalPages = 1;
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
        vm.showChart = false;
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
        vm.user = [];
        vm.containerReportHistory = [];

        vm.selectedDate = formatDate();
        var map = new BMap.Map("map-div",{minZoom:8,maxZoom:8});          // 创建地图实例


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

        function getReportDetailHistory()
        {

        }

        vm.onChartClick = function(param){
            console.log(param);
            console.log(param.name);
            //var year-month =
            $timeout(function () {
                vm.searchTime = param.name;
                vm.selectedDate = param.name.substr(0,7);
                console.log(vm.searchTime);
                vm.containerReportHistory = [];
                NetworkService.get('rentservice/boxbill/detail/' + username+'/' + vm.selectedDate,null,function (response) {

                    var tmp = response.data.results;
                    if(tmp != null && tmp.length > 0){
                        for(var i = 0; i < tmp.length; i ++){
                            vm.containerReportHistory[i] = {};
                            vm.containerReportHistory[i].containerId = tmp[i].box.deviceid;
                            vm.containerReportHistory[i].type = tmp[i].box.type.box_type_name;
                            vm.containerReportHistory[i].startTime = tmp[i].lease_start_time;
                            vm.containerReportHistory[i].endTime = tmp[i].lease_end_time;
                            vm.containerReportHistory[i].amount = tmp[i].rent;

                        }
                    }


                },function (response) {
                    toastr.error(response.statusText);
                });



            });




        }
        function refreshChart()
        {

            var containerNum = [];
            var amount = [];
            var month = [];
            if(vm.userTmp != null && vm.userTmp.length > 0) {
                vm.showChart = true;
                for (var i = 0; i < vm.userTmp.length; i++) {
                    vm.user[i] = {};
                    vm.user[i].time = vm.userTmp[i].date.length > 7 ? vm.userTmp[i].date.substr(0, 7) : vm.userTmp[i].date;
                    vm.user[i].usedContainer = vm.userTmp[i].on_site_nums;
                    vm.user[i].amount = vm.userTmp[i].rent_fee;

                }


                for (var i = 0; i < vm.user.length; i++) {

                    containerNum.push(vm.user[i].usedContainer);
                    amount.push(vm.user[i].amount);
                    month.push(vm.user[i].time);
                }

                if (month.length > 0) {
                    vm.selectedDate = month[month.length - 1].substr(0, 7);
                }
                console.log(vm.selectedDate);
                vm.reportOption = {
                    title: {
                        text: '历史记录',
                        textStyle: {//标题内容的样式
                            color: '#4668E7',//京东红
                            fontStyle: 'normal',//主标题文字字体风格，默认normal，有italic(斜体),oblique(斜体)
                            fontWeight: "bold",//可选normal(正常)，bold(加粗)，bolder(加粗)，lighter(变细)，100|200|300|400|500...
                            fontFamily: "PingFangSC-Medium",//主题文字字体，默认微软雅黑
                            fontSize: 24//主题文字字体大小，默认为18px
                        },
                        textAlign: 'left',//标题文本水平对齐方式，建议不要设置，就让他默认，想居中显示的话，建议往下看
                        textBaseline: "top",//默认就好,垂直对齐方式,不要设置
                        left: 100
                    },

                    event: [
                        {click: vm.onChart}
                    ],
                    /*tooltip : {
                        trigger: 'axis',
                        axisPointer: {
                            animation: false
                        }
                    },*/

                    tooltip : {
                        trigger: 'axis',
                        //formatter: "{a}: {c}"
                        formatter : function (params) {
                            var ret = '';
                            if(params && params.length > 0) {
                                ret = params[0].name + '<br/>';
                                for (var i = 0; i < params.length; i++) {
                                    ret += params[i].seriesName + ' : ' + params[i].value;
                                    ret += '<br/>'
                                }
                            }
                            //console.log(params);
                            return ret;
                        }


                    },




                    legend: {
                        x: 'left',               // 水平安放位置，默认为全图居中，可选为：
                        y: 'bottom',
                        data: ['该月归还数', '该月金额'],
                        //left: 100
                    },
                    xAxis: [{
                        type: 'category',
                        data: month,
                        axisLabel: {
                            textStyle: {
                                color: "#222"
                            }
                        }
                    }],
                    yAxis: [{
                        type: 'value'
                            },
                            {
                            type: 'value',
                            //show: false
                            splitLine: {
                                show: false
                            }
                        }],
                    series: [
                        {
                            yAxisIndex: 0,
                            name: '该月归还数',
                            type: 'line',
                            itemStyle: {normal: {color: '#b6a2de'}},
                            data: containerNum
                        },
                        {
                            yAxisIndex: 1,
                            name: '该月金额',
                            type: 'bar',
                            barWidth : 40,//柱图宽度
                            itemStyle: {normal: {color: '#2ec7c9'}},
                            data: amount
                        }
                    ]
                };


            }

            vm.containerReportHistory = [];
            NetworkService.get('rentservice/boxbill/detail/' + username+'/' + vm.selectedDate,null,function (response) {

                var tmp = response.data.results;
                if(tmp != null && tmp.length > 0){
                    for(var i = 0; i < tmp.length; i ++){
                        vm.containerReportHistory[i] = {};
                        vm.containerReportHistory[i].containerId = tmp[i].box.deviceid;
                        vm.containerReportHistory[i].type = tmp[i].box.type.box_type_name;
                        vm.containerReportHistory[i].startTime = tmp[i].lease_start_time;
                        vm.containerReportHistory[i].endTime = tmp[i].lease_end_time;
                        vm.containerReportHistory[i].amount = tmp[i].rent;

                    }
                }


            },function (response) {
                toastr.error(response.statusText);
            });


        }
        function getTenantItem() {

           // http://106.2.20.185:8000/container/api/v1/cloudbox/rentservice/boxbill/monthbill/dbaac0c6-bea9-11e7-888f-525400d25920
            NetworkService.get('rentservice/boxbill/monthbill/'  + username,null,function (response) {
                vm.userTmp = response.data.results;
                refreshChart();

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