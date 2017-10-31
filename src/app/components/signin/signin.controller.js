
/**
 * Created by Otherplayer on 16/7/25.
 */
(function () {
    'use strict';

    angular.module('smart_container').controller('SigninController', SigninController);

    /** @ngInject */
    function SigninController(logger,toastr,StorageService,$timeout,$state,constdata,$rootScope,iotUtil,$translate,ApiServer) {
        /* jshint validthis: true */
        var vm = this;
        var authorizationKey = constdata.token;
        //语言
        var langChi = '中文';
        var langEng = 'English';
        var userLanguage = window.localStorage.userLanguage;

        vm.user = {username:'',password:''};
        vm.isLogining = false;


        vm.login = loginAction;
        vm.logout = logoutAction;
        vm.username = username;
        vm.gotoRegisterAction = gotoRegisterAction;
        
        function gotoRegisterAction() {
            $state.go('access.signup');
        }
        function loginAction() {

            if (vm.user.username.length == 0 || vm.user.password.length == 0){
                toastr.error('请输入用户名和密码');
                return;
            }

            vm.isLogining = true;
            StorageService.remove(constdata.token);

            var user = {
                    username: vm.user.username,
                    password: vm.user.password
                }

            ApiServer.userLogin(user,function (response) {

                console.log('login success');
                console.log(response);
                var result = response.data;

                var sessionId = result.sessionid;
                var token = result.token;
                var role = result.role;
                var userInfo = {
                    username: user.username,
                    role: role
                }

                // var sessionInfo = {username: user.username, Authorization:token};
                var sessionInfo = {Authorization:token};

                StorageService.put(authorizationKey,sessionInfo,24 * 7 * 60 * 60);//3 天过期
                StorageService.put(constdata.informationKey,userInfo,24 * 3 * 60 * 60);

                var appGo = 'app.overview';


                $state.go(appGo);
            },function (err) {
                console.log(err);
                var errInfo = '登录失败：' + err.statusText + ' (' + err.status +')';
                toastr.error(errInfo);
                vm.isLogining = false;
            });

        }
        function username() {
            var information = StorageService.get(constdata.informationKey);
            return information.username;
        }
        
        function logoutAction() {
            $timeout(function () {
                StorageService.clear(authorizationKey);
                StorageService.clear(userInfo);
                StorageService.clear(constdata.token);
            },60);
            $state.go('access.signin');
        }

        //切换语言
        userLanguage == 'zh-cn' ? vm.langChoosen = langChi : vm.langChoosen = langEng
        userLanguage == 'zh-cn' ? vm.langLeft = langEng : vm.langLeft = langChi
        vm.toggleLang = function(lang) {
            vm.langChoosen = (vm.langChoosen == langChi) ? langEng : langChi
            vm.langLeft = (vm.langLeft == langChi) ? langEng : langChi;
            // console.log(lang);
            lang == langEng ? $translate.use('en-us') : $translate.use('zh-cn');
            lang == langEng ? window.localStorage.userLanguage='en-us' :  window.localStorage.userLanguage='zh-cn'
            // window.location.reload();
        }

    }

})();