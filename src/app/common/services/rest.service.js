(function () {
    'use strict';

    /** RestService */
    angular
        .module('smart_container')
        .factory('RestService', RestService);

    // REST service based on Restangular  that uses setFullResponse
    /** @ngInject */
    function RestService(Restangular, StorageService,logger,constdata, $http,$state,toastr) {
        return Restangular.withConfig(function (RestangularConfigurer) {
            /*var token = StorageService.get(constdata.token);
            console.log('........aaaa');
            console.log(token);
            if (token){
                //token = 'Bearer ' + token;
                RestangularConfigurer.setDefaultHeaders(token);
            }*/
            //RestangularConfigurer.setDefaultHeaders({'kxw':'ok', 'kxw2':'ok2'});
            //RestangularConfigurer.setFullResponse(true);
        });
    }

    /** NetworkService */
    angular
        .module('smart_container')
        .factory('NetworkService', NetworkService);

    /** @ngInject */
    function NetworkService(RestService,StorageService,logger,$rootScope,constdata, $http,$state,toastr) {


        var service = {
            post  : post,
            get   : get,
            put   : put,
            putFile:putFile,
            delete: del
        };

        return service;

        /////////////////



        function putFile(path,body,successHandler,failedHandler) {
            var formdata = new FormData();
            console.log(body);
            formdata.append('editormd-image-file',body);

            /*var token = StorageService.get('iot.hnair.cloud.access_token');
            token = 'Bearer ' + token;
            var reg = RestService.one(path);

            reg.withHttpConfig({transformRequest: angular.identity}).customPOST(formdata, undefined, undefined, {'Content-Type': undefined,'Authorization':token}).then(
                successHandler,function (response) {
                    failedResponse(response,failedHandler,path);
                }
            );*/

            //body.name = '';
            var account = RestService.one(path);
            console.log(body);

            var imgUpload = '/';
            if(constdata.debugMode){
                imgUpload = 'http://106.2.20.186/';
            }
            var uploadPath = imgUpload + 'container/api/v1/cloudbox/rentservice/upload/';

            $http.put(uploadPath + body.name, body).then(
                function (response) {
                    successResponse(response,successHandler);
                },function (response) {
                    failedResponse(response,failedHandler,uploadPath);
                }
            );



            /*account.customPUT(formdata,"",null,{'Content-Type': undefined}).then(function (response) {
                successResponse(response,successHandler);
            },function (response) {
                failedResponse(response,failedHandler,path);
            });*/

        };

        function post(path,param,successHandler,failedHandler) {
            var account = RestService.one(path);
            // var header = {};
            // if (path !== 'account/auth'){
            //     header = requestHeader();
            // }
            account.customPOST(param,"","",requestHeader()).then(
                function (response) {
                    successResponse(response,successHandler);
                },function (response) {
                    failedResponse(response,failedHandler,path);
                }
            );
        }

        function get(path,param,successHandler,failedHandler) {
            var account = RestService.one(path);
            account.customGET("",param,requestHeader()).then(function (response) {
                successResponse(response,successHandler);
            },function (response) {
                console.log(response);
                failedResponse(response,failedHandler,path);
            });
        }

        function put(path,param,successHandler,failedHandler) {
            var account = RestService.one(path);
            account.customPUT(param,"",param,requestHeader()).then(function (response) {
                successResponse(response,successHandler);
            },function (response) {
                failedResponse(response,failedHandler,path);
            });
        }
        function del(path,param,successHandler,failedHandler) {
            var account = RestService.one(path);
            account.customDELETE(param,param,requestHeader()).then(function (response) {
                successResponse(response,successHandler);
            },function (response) {
                console.log('delete failed');
                failedResponse(response,failedHandler,path);
            });
        }

        function successResponse(res,successHandler) {
            var data = res.data;
            if (data){
                if (typeof data === 'string'){
                    try {
                        var rst = angular.fromJson(data);
                        successHandler({data:rst});
                    }catch (e){
                        successHandler({data:null});
                    }
                }else{
                    var rst = angular.fromJson(data);
                    successHandler({data:rst});
                }
            }else{
                successHandler({data:null});
            }
        }
        function failedResponse(response,failedHandler,path) {

            console.log('-------' + path + '---------');
            console.log(response);


            var newResponse = {};
            newResponse.status = response.status;
            newResponse.statusText = '服务器出错，请稍后再试';

            if (response.data && response.data.message) {
                newResponse.statusText = response.data.message;
            }
            if (response.data && response.data.status) {
                newResponse.status = response.status;
            }
            if (response.data && response.data.code) {
                newResponse.code = response.data.code;

            }

            if(response.data && response.data.code === '0401'){
                toastr.error(response.data.message);
                $state.go('access.signin');
            }else if (failedHandler){
                failedHandler(newResponse);
            }

        }

        function requestHeader() {
            var sessionInfo = StorageService.get(constdata.token);
            if (sessionInfo && sessionInfo != 'undefined'){
                return sessionInfo;
            }
            return {};
        }

    }


    /** StorageService */
    angular
        .module('smart_container')
        .service('StorageService', StorageService);

    /** @ngInject */
    function StorageService() {

        this.put=function (key,value,exp) {
            if(window.localStorage){
                var curtime = new Date().getTime();//获取当前时间
                if(!exp){
                    exp = 0;
                }
                localStorage.setItem(key,JSON.stringify({val:value,time:curtime,exp:exp}));//转换成json字符串序列
            }else{
                console.log('This browser does NOT support localStorage');
            }
        };
        this.get=function (key) {
            if(window.localStorage){
                var val = localStorage.getItem(key);
                if (!val) return null;
                var dataobj = JSON.parse(val);

                if (!dataobj) return null;

                if((dataobj.exp !== 0) && (new Date().getTime() - dataobj.time > dataobj.exp * 1000)) {
                    console.log("expires");//过期
                    return null;
                }
                else{
                    //console.log("val="+dataobj.val);
                    return dataobj.val;
                }

            }else{
                console.log('This browser does NOT support localStorage');
                return null;
            }
        };

        this.clear = function (key) {
            localStorage.removeItem(key);
        };

        this.remove = function (key) {
            localStorage.removeItem(key);
        };

        this.item = function (key,value) {
            if (value){
                this.put(key,value,60 * 60);
            }
            var val = this.getItem(key);
            return val;
        };
        this.getItem = function (key) {
            var val = this.get(key);
            return val;
        };

    }

})();
