/**
 * app main controller
 */

(function () {
    'use strict';

    angular.module('smart_container').controller('MainController', MainController);

    /** @ngInject */
    function MainController($rootScope, NetworkService, constdata,StorageService, $timeout,$translate,$location,ApiServer, $state, toastr,$scope) {
       /* jshint validthis: true */
       var vm = this;
       var url = $location.absUrl();
       var theme_11 = {
          themeID: 11,
          navbarHeaderColor: 'bg-dark b-r',
          navbarCollapseColor: 'bg-white',
          asideColor: 'bg-dark b-r',
          headerFixed: true,
          asideFixed: true,
          asideFolded: false,
          asideDock: false,
          container: false
      };

      // config
        $scope.app = {
        name: 'air cc',
        version: '0.0.1',
        // for chart colors
        color: {
          primary: '#7266ba',
          info:    '#23b7e5',
          success: '#27c24c',
          warning: '#fad733',
          danger:  '#f05050',
          light:   '#e8eff0',
          dark:    '#3a3f51',
          black:   '#1c2b36'
        },
        settings: theme_11
      };




        var userDetailInfo = StorageService.get(constdata.informationKey);

        $scope.avatarUrl = 'images/a0.jpg';
        if(userDetailInfo != null) {
            $scope.avatarUrl = userDetailInfo.avatarUrl;
        }


        $rootScope.$on('to-profile', function(d,data) {
            userDetailInfo = StorageService.get(constdata.informationKey);

            if(userDetailInfo == null){
                $state.go('access.signin');
            }
            NetworkService.get('rentservice/enterpriseuser/detail/' + userDetailInfo.userId + '/',null,function (response) {
             var userDetail = response.data;
                userDetailInfo.avatarUrl = userDetail.avatar_url;
                StorageService.put(constdata.informationKey,userDetailInfo,24 * 3 * 60 * 60);
                $scope.avatarUrl = userDetailInfo.avatarUrl;

             },function (response) {
                toastr.error(response.statusText);
             });
        });

      // angular translate
        $scope.lang = { isopen: false };
        $scope.langs = {'en-us':'English', 'zh-cn':'中文'};
        $scope.selectLang = $scope.langs[$translate.proposedLanguage()] || "中文";
        $scope.setLang = function(langKey, $event) {
        // set the current lang
            $scope.selectLang = $scope.langs[langKey];
        // You can change the language during runtime
        $translate.use(langKey);
        $scope.lang.isopen = !$scope.lang.isopen;
      };

        vm.awesomeThings = [];
        vm.classAnimation = '';
        vm.creationDate = 1452231070467;

         /*if (ApiServer.isAuthed()){
                $state.go('app.overview');
        }else{
            //$timeout(function () {
                $state.go('access.signin');
            //},10);
        }*/

    }
})();
