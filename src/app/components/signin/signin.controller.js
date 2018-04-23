
/**
 * Created by Otherplayer on 16/7/25.
 */
(function () {
    'use strict';

    angular.module('smart_container').controller('SigninController', SigninController);

    /** @ngInject */
    function SigninController(logger,md5, toastr,StorageService,$timeout,$state,constdata,$rootScope,iotUtil,$translate,ApiServer) {
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
       // vm.logout = logoutAction;
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
            var now = new Date;
            now = parseInt(now / 1000);
            console.log(md5.createHash(vm.user.password));
            var user = {
                    username: vm.user.username,
                    password:  md5.createHash(md5.createHash(vm.user.password)+now),
                    timestamp:now
                }


            ApiServer.userLogin(user,function (response) {
                // debugger


                var result = response.data;

                var sessionId = result.sessionid;
                var token = result.user_token;
                var role = result.role;
                var userInfo = {
                    username: user.username,
                    role: role,
                    userId:result.user_id,
                    userRealName:result.user_real_name,
                    userNickName:result.user_nickname,
                    avatarUrl:result.avatar_url
                }

                // var sessionInfo = {username: user.username, Authorization:token};
                var sessionInfo = {Authorization:token};
                console.log(userInfo);
                StorageService.put(authorizationKey,sessionInfo,24 * 7 * 60 * 60);//3 天过期
                StorageService.put(constdata.informationKey,userInfo,24 * 3 * 60 * 60);

                var appGo = 'app.dashboard';
                $state.go(appGo);
                //vm.getBasePath =  'rentservice/enterpriseuser/detail/';
                /*NetworkService.get('rentservice/enterpriseuser/detail/' + result.user_id + '/',null,function (response) {
                    vm.userDetail = response.data;
                    vm.user.enterprise_id = vm.user.enterprise;
                    StorageService.put(constdata.userDetailKey,vm.userDetail,24 * 3 * 60 * 60);

                },function (response) {
                    toastr.error(response.statusText);
                });*/






            },function (err) {
                console.log(err);
                var errInfo = '登录失败：' + err.statusText;
                toastr.error(errInfo);
                vm.isLogining = false;
            });
           // $state.go('app.dashboard');


        }
        function username() {
            var information = StorageService.get(constdata.informationKey);
            return information.username;
        }
        
        /*function logoutAction() {
            console.log('bbbb');
            $state.go('access.signin');
            console.log('aaaaaaaa');
            $timeout(function () {
                StorageService.clear(authorizationKey);
                StorageService.clear(userInfo);
                StorageService.clear(constdata.token);
            },60);

        }*/

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