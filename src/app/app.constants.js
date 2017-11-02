/* global angular:false, malarkey:false, moment:false */
(function () {
    'use strict';

    // Constants used by the entire app
    angular.module('smart_container')
        .constant('malarkey', malarkey)
        .constant('moment', moment)
        .constant('constdata', {
            debugMode: true,//http://52.80.40.26:9090/
            logLevel: 111111,//控制log显示的级别（0不显示,1显示）,从左到右每位分别代表[error,warn,info,debug,log]
            apiHost_ONLINE:'/container/api/v1/cloudbox/', //http://54.223.162.108:9090/ production1
            // apiHost_OFFLINE:'http://52.80.40.26:9090/',//http://54.223.29.24:9090/ production2
            // local JSON-server:
            apiHost_OFFLINE:'http://106.2.20.186/container/api/v1/cloudbox/', //http://54.223.162.108:9090/ production1
            //apiHost_OFFLINE:'/container/api/v1/cloudbox/', //http://54.223.162.108:9090/ production1

            //apiHost_OFFLINE:'http://localhost:5000/container/api/v1/cloudbox/',
            // apiHost_OFFLINE:'http://192.168.100.97:8000/api/v1/cloudbox/safeParam/',
            // apiHost_OFFLINE:'http://localhost:4000/container/api/v1/cloudbox/',
            // apiHost_OFFLINE:'http://172.16.2.189:8000/',
            token:'airspc_access_authorization',
            informationKey:'airspc_information',
            refreshInterval: 300000,
            defaultContainerId : '01-03-17-09-00-22',//constdata.api.uploadFile.qiniuPath
            api:{
                resource:{
                    vehicle:'resource/vehicle',
                    shippingSchedule:'resource/shippingschedule',
                    container:'resource/container',
                    transportTask:'resource/transporttask'
                },
                uploadFile:{
                  qiniuPath:'uploadFile'
                },
                overview: {
                    satelites: 'satellites',
                    containers: "containers",
                    pipelines: "pipelines",
                    alertLevel:"alertLevel"
                },
                auth:'auth',
                containerhistory : "containerhistory",
                containerInstantInfo : "containerInstantInfo",
                containerReportHistory : "containerReportHistory",
                containerHistoryStatus : "containerHistoryStatus",
                basicInfoManage : "basicInfoManage",
                issueInfo : "issueInfo",
                repairInfo : "repairInfo",
                basicInfoConfig : "basicInfoConfig",
                securityConfig : "securityConfig",
                repairConfig : "repairConfig",
                issueConfig : "issueConfig",
                alerts : "alerts",
                basicInfo : "basicInfo",
                boxStatus : "boxStatus",
                realtimeInfo : "realtimeInfo",
                options : "options",
                carriers : "carriers",
                newcarrier : "newcarrier",
                mycontainers : "mycontainers",
                availablecontainers : "availablecontainers",
                containersonlease : "containersonlease",
                requestlease : "requestlease",
                returncontainer : "returncontainer",
                command : "command",
                analysisresult : "analysisresult",
                operationoverview : "operationoverview",
                user:'user',
                message:'message'
            },
            routeName:{
                "app.dashboard":"全景展示",
                "app.mapview":"地图展示",
                "app.signin":"登陆"
            },
            map:{
                mapStyle: { 
                    features: ["road", "building","water","land"],//隐藏地图上的poi
                    style : "light"  //设置地图风格为高端黑
                }
            }
        });
})();
