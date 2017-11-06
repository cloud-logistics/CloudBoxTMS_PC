/**
 * app main controller
 */

(function () {
    'use strict';

    angular.module('smart_container').controller('AsideController', AsideController);

    /** @ngInject */
    function AsideController(ApiServer,$state, StorageService, constdata) {
        /* jshint validthis: true */
        var vm = this;
        //var info = ApiServer.info();

        var height = document.body.clientHeight + 'px';
        vm.navStyle = {'height':height};

        vm.clearAllMessageAction = clearAllMessageAction;
        vm.logoutAction = logoutAction;

        vm.messages = [];
        vm.title = '智能租赁';

        if(StorageService.get(constdata.informationKey) != null && StorageService.get(constdata.informationKey) != '') {
            vm.role = StorageService.get(constdata.informationKey).role;
        }
        vm.role = 'admin';
        function clearAllMessageAction() {
            vm.messages = [];
            for (var i = 0; i < vm.messages.length; i++){
                var msg = vm.messages[i];
                ApiServer.messageDelete(msg.messageid);
            }
        }

        
        function logoutAction() {
            console.log('logout....');
            ApiServer.logoutAction();
        }
        
        


    }
})();
