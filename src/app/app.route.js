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
            .otherwise('/access/signin');
        $stateProvider
            .state('app', {
                //abstract: true,
                url: '/',
                controller: 'MainController',
                controllerAs: 'main',
                templateUrl: 'app/main/main.html'
            })
            .state('app.dashboard', {
                url: 'dashboard',
                templateUrl: 'app/components/dashboard/dashboard.html'
            })
            //云箱基础信息管理
            .state('app.boxbasic',{
                url: 'boxbasic',
                templateUrl: 'app/components/basic/boxbasic.html'
            })

            .state('app.edit_boxbasic', {
                url: 'boxbasic/edit/:username',
                params : {args : {}},
                templateUrl: 'app/components/basic/boxbasic.edit.html'
            })
            .state('app.transportation_company', {
                url: 'transportation_company',
                templateUrl: 'app/components/transportation_company/transportation_company.html'
            })
            .state('app.edit_transportation_company', {
                url: 'transportation_company/edit/:username',
                params : {args : {}},
                templateUrl: 'app/components/transportation_company/transportation_company.edit.html'
            })
            .state('app.transportation_company_user', {
                url: 'transportation_company_user',
                params : {args : {}},
                templateUrl: 'app/components/transportation_company/transportation_company_user.html'
            })
            .state('app.edit_transportation_company_user', {
                url: 'transportation_company_user/edit/:username',
                params : {args : {}},
                templateUrl: 'app/components/transportation_company/transportation_company_user.edit.html'
            })

            .state('app.transportation_company_admin', {
                url: 'transportation_company_admin',
                templateUrl: 'app/components/transportation_company/transportation_company_admin.html'
            })
            .state('app.edit_transportation_company_admin', {
                url: 'transportation_company_admin/edit/:username',
                params : {args : {}},
                templateUrl: 'app/components/transportation_company/transportation_company_admin.edit.html'
            })
            .state('app.warehouse', {
                url: 'warehouse',
                templateUrl: 'app/components/warehouse/warehouse.html'
            })
            .state('app.edit_warehouse', {
                url: 'warehouse/edit/:username',
                params : {args : {}},
                templateUrl: 'app/components/warehouse/warehouse.edit.html'
            })

            .state('app.report', {
                url: 'report',
                templateUrl: 'app/components/report/report.html'
            })
            .state('app.edit_report', {
                url: 'report/edit/:username',
                params : {args : {}},
                templateUrl: 'app/components/report/report.edit.html'
            })
            .state('access', {
                url: '/access',
                template: '<div ui-view class="fade-in-right-big smooth"></div>'
            })
            .state('access.signin', {
                url: '/signin',
                templateUrl: 'app/components/signin/signin.html',
                controller: 'SigninController',
                controllerAs: 'vm'
            })
            .state('access.signup', {
                url: '/signup',
                templateUrl: 'app/components/signin/signup.html'
            })
            .state('app.profile', {
                url: 'profile',
                templateUrl: 'app/components/profile/profile.html'
            })
            .state('app.company', {
                url: 'regular/company?type',
                templateUrl: 'app/components/company/company.html'
            });
    }

})();
