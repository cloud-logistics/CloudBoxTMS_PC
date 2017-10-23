(function () {
    'use strict';

    /** @ngInject */
    angular
        .module('smart_container')
        .config(routeConfig)
        .run(function($rootScope, $state, $stateParams,constdata,$location) {
            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;
            $rootScope.pageRoutes = [];
            var count = 0;

            $rootScope.$on("$stateChangeSuccess",  function(event, toState, toParams, fromState, fromParams) {
                // to be used for back button //won't work when page is reloaded.
                var findedIndex = -1;
                $rootScope.previousState_name = fromState.name;
                $rootScope.previousState_params = fromParams;
                var myUrl = constdata.routeName[toState.name];
                var routeObj = {
                url : myUrl,
                name : toState.name,
                params : toParams
                }

                var firstLevelNav = [
                    'app.overview',
                    'app.monitor',
                    'app.pipelineview',
                    'app.satellite',
                    'app.container_overview',
                    'app.signin'
                ];

                //点击一级把一级和后面所有的route全部去掉
                if ( R.any(R.equals(routeObj.name))(firstLevelNav) ) {
                    // have to use splice, otherwise, nav works abnormal, do not know why...
                    $rootScope.pageRoutes.splice(0);
                } else {
                    findedIndex = R.findIndex(R.propEq("name", routeObj.name))($rootScope.pageRoutes)
                    //去掉同一级别的route及以后的route
                    if (findedIndex !== -1) {
                        var dropLen = R.length($rootScope.pageRoutes) - findedIndex;
                        $rootScope.pageRoutes.splice(findedIndex, dropLen);
                        // $rootScope.pageRoutes = R.dropLast(dropLen)($rootScope.pageRoutes)
                    }
                }

                $rootScope.pageRoutes.push(routeObj);

                //对后追加的两个routeName进行去重处理
                // checkLastTwoRoute($rootScope.pageRoutes);

                //数组去重处理函数
                function checkLastTwoRoute(arr) {
                var arrLen = arr.length;
                if(arrLen>=2) {
                    //后两个重复处理
                    if(arr[arrLen-1].url == arr[arrLen-2].url) {
                    arr.splice(arrLen-1,1);
                    return;
                    }
                    //最后一个和前面的某一个重复处理
                    var arrExceptLast = arr.slice(0, arrLen-2);
                    var urlArrExceptLast = [];
                    arrExceptLast.forEach(function(item, index) {
                    urlArrExceptLast.push(item.url);
                    });
                    var findIndex = urlArrExceptLast.indexOf(arr[arrLen-1].url);
                    findIndex>=0 ? arr.splice(findIndex+1) : console.log();
                }
                }
            });
            //back button function called from back button's ng-click="backPre()"
            $rootScope.backPre = function() {//实现返回的函数
                $state.go($rootScope.previousState_name,$rootScope.previousState_params);
            };
        });


    function routeConfig($stateProvider, $urlRouterProvider) {

        // $locationProvider.html5Mode(true);
        $urlRouterProvider
            .otherwise('app');
        $stateProvider
            .state('app.dashboard', {
                url: 'dashboard',
                templateUrl: 'app/components/dashboard/dashboard.html'
            })
            //全景地图
            .state('app.overview', {
                url: 'overview',
                templateUrl: 'app/components/overview/overview.html'
            })

            //云箱监控
            .state('app.monitor',{
                url: 'monitor',
                templateUrl: 'app/components/monitor/monitor.html'
            })
            //告警详情
            .state('app.alert',{
                url: 'alert/:containerId/:alertLevel/:alertType/:alertCode',
                templateUrl: 'app/components/monitor/alert.html'
            })
            //云箱状态汇总
            .state('app.boxstatus',{
                url: 'boxstatus/:containerId/:alertLevel/:alertType',
                templateUrl: 'app/components/monitor/boxstatus.html'
            })
            //历史报文查询
            .state('app.history',{
                url: 'history/:containerId/:containerType/:startTime/:endTime',
                templateUrl: 'app/components/monitor/history.html'
            })
            //基础信息查询
            .state('app.basicinfo',{
                url: 'basicinfo/:containerId/:containerType/:factory',
                templateUrl: 'app/components/monitor/basicinfo.html'
            })

            //实时报文详情
            .state('app.realtime',{
                url: 'realtime/:containerId',
                templateUrl: 'app/components/monitor/realtime.html'
            })
            //机器人监控
            .state('app.robots',{
                url: 'robots',
                templateUrl: 'app/components/monitor/robots.html'
            })

            //租赁admin
            .state('app.lease',{
                url: 'lease',
                templateUrl: 'app/components/lease/lease.html'
            })
            //租赁管理
            .state('app.leasemanage',{
                url: 'leasemanage',
                templateUrl: 'app/components/lease/leaseManage.html'
            })

            //租赁承运商
            .state('app.mylease',{
                url: 'mylease',
                templateUrl: 'app/components/lease/mylease.html'
            })

            //基础信息查询
            .state('app.basicmanage',{
                url: 'basicmanage',
                templateUrl: 'app/components/monitor/basicmanage.html'
            })

            //云箱信息查询
            .state('app.boxdetail',{
                url: 'boxdetail',
                templateUrl: 'app/components/monitor/boxDetail.html'
            })

            //云箱参数设置
            .state('app.boxparam',{
                url: 'boxparam',
                templateUrl: 'app/components/basic/boxparam.html'
            })

            //云箱基础信息管理
            .state('app.boxbasic',{
                url: 'boxbasic',
                templateUrl: 'app/components/basic/boxbasic.html'
            })

            //云箱报警处理设置
            .state('app.boxalert',{
                url: 'boxalert',
                templateUrl: 'app/components/basic/boxalert.html'
            })

            //云箱故障库设置
            .state('app.boxmalfun',{
                url: 'boxmalfun',
                templateUrl: 'app/components/basic/boxmalfun.html'
            })

            .state('app.satellite',{
                url: 'satellite',
                templateUrl: 'app/components/satellite/satellite.html'
            })

            .state('app.container_overview',{
                url: 'container_overview',
                templateUrl: 'app/components/container_overview/container_overview.html'
            })

            .state('app.historylocation',{
                url: 'historylocation/:containerId/:startTime/:endTime',
                templateUrl: 'app/components/monitor/historylocation.html'
            })

            .state('app.instantlocation',{
                url: 'instantlocation/:containerId',
                templateUrl: 'app/components/monitor/instantlocation.html'
            })

            .state('app.command',{
                url: 'command/:containerId/:endpointId',
                templateUrl: 'app/components/monitor/command.html'
            })
            .state('app.allhist',{
                url: 'allhist',
                templateUrl: 'app/components/analysis/allHist.html'
            })
            .state('app.sitehist',{
                url: 'sitehist',
                templateUrl: 'app/components/analysis/siteHist.html'
            })


            /** LOGIN **/
            .state('access', {
                url: '/access',
                templateUrl: 'signin.html',
                controller: 'SigninController',
                controllerAs: 'vm'
            })
            .state('access.signin', {
                url: '/signin',
                templateUrl: 'app/components/signin/signin.html'
            })
            .state('access.signup', {
                url: '/signup',
                templateUrl: 'app/components/signin/signup.html'
            })


            .state('app.profile', {
                url: 'user/profile',
                templateUrl: 'app/components/profile/profile.html'
            })
            .state('app.company', {
                url: 'regular/company?type',
                templateUrl: 'app/components/company/company.html'
            })

            /** ACCOUNT **/

            //////用户
            .state('app.userorder', {
                url: 'regular/order',
                templateUrl: 'app/components/order/user.order.html'
            })
            .state('app.userorderadd', {
                url: 'regular/order/:orderId',
                templateUrl: 'app/components/order/user.order.add.html'
            })


            //////货代公司
            .state('app.goodorder', {
                url: 'good/order',
                templateUrl: 'app/components/order/good.order.html'
            })
            .state('app.goodorderadd', {
                url: 'good/order/:orderId',
                templateUrl: 'app/components/order/good.order.add.html'
            })
            .state('app.goodordercar', {
                url: 'good/order/:orderId/car',
                templateUrl: 'app/components/order/good.order.car.html'
            })
            .state('app.goodorderspace', {
                url: 'good/order/:orderId/space',
                templateUrl: 'app/components/order/good.order.space.html'
            })
            .state('app.goodstorages', {
                url: 'good/storages',
                templateUrl: 'app/components/storage/storages.html'
            })
            .state('app.goodstorage', {
                url: 'good/storage',
                templateUrl: 'app/components/storage/storage.html'
            })

            //////拖车公司
            .state('app.carorder', {
                url: 'car/order',
                templateUrl: 'app/components/order/car.order.html'
            })
            .state('app.carorderadd', {
                url: 'car/order/:orderId',
                templateUrl: 'app/components/order/car.order.add.html'
            })
            .state('app.carorderaddpacking', {
                url: 'car/order/packing/:orderId',
                templateUrl: 'app/components/order/car.order.packing.html'
            })
            .state('app.vehicles', {
                url: 'car/vehicles',
                templateUrl: 'app/components/vehicle/vehicles.html'
            })
            .state('app.vehicle', {
                url: 'car/vehicle/:vehicleId',
                templateUrl: 'app/components/vehicle/vehicle.html'
            })
            .state('app.transporttask', {
                url: 'car/transporttask',
                templateUrl: 'app/components/transporttask/transporttask.html'
            })

            //////船运公司
            .state('app.shiporder', {
                url: 'ship/order',
                templateUrl: 'app/components/order/ship.order.html'
            })
            .state('app.shiporderadd', {
                url: 'ship/order/:orderId',
                templateUrl: 'app/components/order/ship.order.add.html'
            })
            .state('app.containers', {
                url: 'ship/containers',
                templateUrl: 'app/components/container/containers.html'
            })
            .state('app.container', {
                url: 'ship/container/:containerId',
                templateUrl: 'app/components/container/container.html'
            })
            .state('app.shippingschedule', {
                url: 'ship/shippingschedule',
                templateUrl: 'app/components/shippingschedule/shippingschedule.html'
            })
            .state('app.shippingscheduleadd', {
                url: 'ship/shippingschedule/:shippingScheduleId',
                templateUrl: 'app/components/shippingschedule/shippingschedule.add.html'
            })


            .state('app', {
                //abstract: true,
                url: '/',
                controller: 'MainController',
                controllerAs: 'main',
                templateUrl: 'app/main/main.html'
            })

        ;
    }

})();
