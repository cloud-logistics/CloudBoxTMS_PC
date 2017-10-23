var jsonServer = require('json-server')

// Returns an Express server
var server = jsonServer.create()

// Set default middlewares (logger, static, cors and no-cache)
server.use(jsonServer.defaults())

var router = jsonServer.router('db.json')

server.use(jsonServer.rewriter({
  // '/user/111': '/user',
  '/container/api/v1/cloudbox/auth': '/auth',
  '/container/api/v1/cloudbox/message': '/messageByUserId',
  '/container/api/v1/cloudbox/containerhistory': '/containerhistory',
  '/container/api/v1/cloudbox/containerInstantInfo': '/containerInstantInfo',
  '/container/api/v1/cloudbox/containerReportHistory': '/containerReportHistory',
  '/container/api/v1/cloudbox/containerHistoryStatus': '/containerHistoryStatus',
  '/container/api/v1/cloudbox/alerts': '/alerts',
  '/container/api/v1/cloudbox/basicInfo': '/basicInfo',
  '/container/api/v1/cloudbox/boxStatus': '/boxStatus',
  '/container/api/v1/cloudbox/realtimeInfo': '/realtimeInfo',
  "/container/api/v1/cloudbox/satellites": "/satelites",
  "/container/api/v1/cloudbox/containers": "/containers",
  "/container/api/v1/cloudbox/alertLevel":"/alertLevel",
  "/container/api/v1/cloudbox/basicInfoManage":"/basicInfoManage",
  "/container/api/v1/cloudbox/issueInfo":"/issueInfo",
  "/container/api/v1/cloudbox/repairInfo":"/repairInfo",
  "/container/api/v1/cloudbox/basicInfoConfig":"/basicInfoConfig",
  "/container/api/v1/cloudbox/securityConfig":"/securityConfig",
  "/container/api/v1/cloudbox/getSecurityConfig":"/getSecurityConfig",
  "/container/api/v1/cloudbox/repairConfig":"/repairConfig",
  "/container/api/v1/cloudbox/issueConfig":"/issueConfig",
  "/container/api/v1/cloudbox/issueConfig":"/issueConfig",
  "/container/api/v1/cloudbox/options":"/options",
  "/container/api/v1/cloudbox/carriers":"/carriers",
  "/container/api/v1/cloudbox/newcarrier":"/newcarrier",
  "/container/api/v1/cloudbox/mycontainers":"/mycontainers",
  "/container/api/v1/cloudbox/containersonlease":"/containersonlease",
  "/container/api/v1/cloudbox/requestlease":"/requestlease",
  "/container/api/v1/cloudbox/returncontainer":"/returncontainer",
  "/container/api/v1/cloudbox/availablecontainers":"/availablecontainers",
  "/container/api/v1/cloudbox/command":"/command",
  "/container/api/v1/cloudbox/analysisresult":"/analysisresult",
  "/container/api/v1/cloudbox/operationoverview":"/operationoverview"
}))

server.post('/auth', function (req, res) {
  res.json({
    "userid": "111",
    // "sessionid": "111",
    "token": 'eyJraWQiOiJJT1RfU0VDVVJFS0VZIiwiYWxnIjoiUlMyNTYifQ.eyJpc3MiOiJJT1RfUExBVEZPUk1fSVNTVUVSIiwiYXVkIjoiSU9UX1BMQVRGT1JNX0FVRElFTkNFIiwiZXhwIjoxNzgwMDc0MTU1LCJqdGkiOiJjcTFDMC10RVBXUEk1XzN2Z1FsQ2RBIiwiaWF0IjoxNDY5MDM0MTU1LCJzdWIiOiJhZG1pbiIsImNsYWltLnJvbGVzIjpbIkFETUlOIl19.pzXQDv82gPrpNVas_2DHt8mihoNhqw8mnAMlDwnCC-Jkj5xodi_UBTVG8thOLaNSSLpflOqhJ8eJMstZTEJI9Nsoy1axBIun-U47NGpeZF76GUI9vh7wf_9EpwKVs0UDyK5amAVrzyiO6nQEjtMPPbGX_fWfUasB_JP5H34O2pqTl5cb6irSoJxB-_MB7lxZYJ4V9u0W9XRuFbaQtdG5YSiib7-WHHEhOIQ6X3Xg7y9josfUf41BfD9cOs2U_k3WZjiiosZVajy8DatMxF96BZuGVRh4VxozvczuiThyLAcsXW2TjYen4bgGJcH2AG7ip002NDrPxpaE2STcJwtxBQ',
    "role": "carrier"
  });
})

server.get('/auth', function (req, res) {
  res.json({
    "userid": "111",
    // "sessionid": "111",
    "token": 'eyJraWQiOiJJT1RfU0VDVVJFS0VZIiwiYWxnIjoiUlMyNTYifQ.eyJpc3MiOiJJT1RfUExBVEZPUk1fSVNTVUVSIiwiYXVkIjoiSU9UX1BMQVRGT1JNX0FVRElFTkNFIiwiZXhwIjoxNzgwMDc0MTU1LCJqdGkiOiJjcTFDMC10RVBXUEk1XzN2Z1FsQ2RBIiwiaWF0IjoxNDY5MDM0MTU1LCJzdWIiOiJhZG1pbiIsImNsYWltLnJvbGVzIjpbIkFETUlOIl19.pzXQDv82gPrpNVas_2DHt8mihoNhqw8mnAMlDwnCC-Jkj5xodi_UBTVG8thOLaNSSLpflOqhJ8eJMstZTEJI9Nsoy1axBIun-U47NGpeZF76GUI9vh7wf_9EpwKVs0UDyK5amAVrzyiO6nQEjtMPPbGX_fWfUasB_JP5H34O2pqTl5cb6irSoJxB-_MB7lxZYJ4V9u0W9XRuFbaQtdG5YSiib7-WHHEhOIQ6X3Xg7y9josfUf41BfD9cOs2U_k3WZjiiosZVajy8DatMxF96BZuGVRh4VxozvczuiThyLAcsXW2TjYen4bgGJcH2AG7ip002NDrPxpaE2STcJwtxBQ',
    "role": "carrier"
  });
})

server.post('/containerInstantInfo', function (req, res) {
  res.json({
    "containerInfo": {
      "containerId": "111",
      "carrier": "中集智能"
    },
    "startPosition": {
      "lng": 117,
      "lat": 36.65
    },
    "startLocationName": "中国上海市",
    "currentPosition": {
      "lng": 118.78,
      "lat": 32.04
    },
    "currentLocationName": "中国上海市",
    "endPosition": {
      "lng": 121.557348,
      "lat": 31.179784
    },
    "endLocationName": "中国上海市"
  });
})


server.post('/containerReportHistory', function (req, res) {
  res.json({
    "result": [
      {
        "containerId": "22932214122313",
        "containerType": "标准云箱",
        "messageType": "实时报文",
        "record": "11111111111",
        "time": 1495597347299
      },
      {
        "containerId": "22932214122313",
        "containerType": "标准云箱",
        "messageType": "实时报文",
        "record": "2222222222",
        "time": 1495597347299
      },
      {
        "containerId": "22932214122313",
        "containerType": "标准云箱",
        "messageType": "实时报文",
        "record": "33333333333",
        "time": 1495597347299
      },
      {
        "containerId": "22932214122313",
        "containerType": "标准云箱",
        "messageType": "实时报文",
        "record": "4444444444",
        "time": 1495597347299
      },
      {
        "containerId": "22932214122313",
        "containerType": "标准云箱",
        "messageType": "实时报文",
        "record": "23-3030202",
        "time": 1495597347299
      }
    ]
  });
})

server.post('/containerHistoryStatus', function (req, res) {
  res.json({
    "temperature": [
      {
        "value": 33,
        "time": "1～2"
      },
      {
        "value": 35,
        "time": "2～3"
      },
      {
        "value": 32,
        "time": "3～4"
      },
      {
        "value": 30,
        "time": "4～5"
      },
      {
        "value": 35,
        "time": "5～6"
      },
      {
        "value": 34,
        "time": "6～7"
      },
      {
        "value": 33,
        "time": "7～8"
      },
      {
        "value": 32,
        "time": "8～9"
      },
      {
        "value": 35,
        "time": "9～10"
      },
      {
        "value": 39,
        "time": "10～11"
      },
      {
        "value": 35,
        "time": "11～12"
      },
      {
        "value": 38,
        "time": "12～13"
      },
      {
        "value": 39,
        "time": "13～14"
      }
    ],
    "humidity": [
      {
        "value": 0.65,
        "time": "8～9"
      }
    ],
    "battery": [
      {
        "value": 0.65,
        "time": "8～9"
      }
    ],
    "speed": [
      {
        "value": 65,
        "time": "8～9"
      }
    ],
    "boxStatus": [
      {
        "num_of_door_open": 10,
        "num_of_collide": 10,
        "time": "8～9"
      }
    ]
  });
})

server.post('/alerts', function (req, res) {
  res.json({
    "alerts": [
      {
        "containerId": "22932214122313",
        "endpointId":"111",
        "alertTime": 1495597347299,
        "alertLevel": "高",
        "alertType": "失联",
        "alertCode": "0x1101",
        "status": "在运",
        "carrier": "中集集团",
        "position": {
          "lng": 121.557348,
          "lat": 31.179784
        },
        "locationName": "中国上海市",
        "speed": 100,
        "temperature": 39,
        "humidity": 0.7,
        "num_of_collide": 30,
        "num_of_door_open": 20,
        "battery": 0.5,
        "robertOperationStatus": "卸货"
      },
       {
        "containerId": "22932214122313",
        "endpointId":"222",
        "alertTime": "1495597347299",
        "alertLevel": "高",
        "alertType": "失联",
        "alertCode": "0x1101",
        "status": "在运",
        "carrier": "中集集团",
        "position": {
          "lng": 121.557348,
          "lat": 31.179784
        },
        "locationName": "中国上海市",
        "speed": 100,
        "temperature": 39,
        "humidity": 0.7,
        "num_of_collide": 30,
        "num_of_door_open": 20,
        "battery": 0.5,
        "robertOperationStatus": "卸货"
      },
      {
        "containerId": "22932214122313",
        "endpointId":"333",
        "alertTime": "1495597347299",
        "alertLevel": "高",
        "alertType": "失联",
        "alertCode": "0x1101",
        "status": "在运",
        "carrier": "中集集团",
        "position": {
          "lng": 121.557348,
          "lat": 31.179784
        },
        "locationName": "中国上海市",
        "speed": 100,
        "temperature": 39,
        "humidity": 0.7,
        "num_of_collide": 30,
        "num_of_door_open": 20,
        "battery": 0.5,
        "robertOperationStatus": "卸货"
      },
      {
        "containerId": "22932214122313",
        "endpointId":"444",
        "alertTime": "1495597347299",
        "alertLevel": "高",
        "alertType": "失联",
        "alertCode": "0x1101",
        "status": "在运",
        "carrier": "中集集团",
        "position": {
          "lng": 121.557348,
          "lat": 31.179784
        },
        "locationName": "中国上海市",
        "speed": 100,
        "temperature": 39,
        "humidity": 0.7,
        "num_of_collide": 30,
        "num_of_door_open": 20,
        "battery": 0.5,
        "robertOperationStatus": "卸货"
      },
      {
        "containerId": "22932214122313",
        "endpointId":"555",
        "alertTime": "1495597347299",
        "alertLevel": "高",
        "alertType": "失联",
        "alertCode": "0x1101",
        "status": "在运",
        "carrier": "中集集团",
        "position": {
          "lng": 121.557348,
          "lat": 31.179784
        },
        "locationName": "中国上海市",
        "speed": 100,
        "temperature": 39,
        "humidity": 0.7,
        "num_of_collide": 30,
        "num_of_door_open": 20,
        "battery": 0.5,
        "robertOperationStatus": "卸货"
      }
    ]
  });
})

server.post('/boxStatus', function (req, res) {
  res.json({
    "boxStatus": [
      {
        "containerId": "22932214122313",
        "currentStatus": "在运",
        "position": {
          "lng": 121.557348,
          "lat": 31.179784
        },
        "locationName": "中国上海市",
        "carrier": "中集集团",
        "speed": 323,
        "temperature": 39,
        "humidity": 70,
        "num_of_collide": 30,
        "num_of_door_open": 40,
        "battery": 0.6,
        "robot_operation_status": "装箱"
      },
      {
        "containerId": "22932214122313",
        "currentStatus": "在运",
        "position": {
          "lng": 121.557348,
          "lat": 31.179784
        },
        "locationName": "中国上海市",
        "carrier": "中集集团",
        "speed": 323,
        "temperature": 39,
        "humidity": 70,
        "num_of_collide": 30,
        "num_of_door_open": 40,
        "battery": 0.6,
        "robot_operation_status": "装箱"
      },
      {
        "containerId": "22932214122313",
        "currentStatus": "在运",
        "position": {
          "lng": 121.557348,
          "lat": 31.179784
        },
        "locationName": "中国上海市",
        "carrier": "中集集团",
        "speed": 323,
        "temperature": 39,
        "humidity": 70,
        "num_of_collide": 30,
        "num_of_door_open": 40,
        "battery": 0.6,
        "robot_operation_status": "装箱"
      }
    ]
  });
})

server.post('/containerhistory', function (req, res) {
  res.json({
    "containerhistory": [
      {
        "containerId": "111",
        "start": {
          "time": "111",
          "locationName": "\u4e2d\u56fd\u5c71\u4e1c\u7701\u9752\u5c9b\u5e02\u5e02\u5357\u533a\u70df\u96e8\u697c\u5bbe\u9986\uff08\u82cf\u5dde\u8def\uff09",
          "position": {
            "lng": 121.557348,
            "lat": 31.179784
          }
        },
        "end": {
          "time": "222",
          "locationName": "\u4e2d\u56fd\u5c71\u4e1c\u7701\u9752\u5c9b\u5e02\u5e02\u5357\u533a\u70df\u96e8\u697c\u5bbe\u9986\uff08\u82cf\u5dde\u8def\uff09",
          "position": {
            "lng": 117,
            "lat": 36.65
          }
        }
      },
      {
        "containerId": "222",
        "start": {
          "time": "111",
          "locationName": "\u4e2d\u56fd\u5c71\u4e1c\u7701\u9752\u5c9b\u5e02\u5e02\u5357\u533a\u70df\u96e8\u697c\u5bbe\u9986\uff08\u82cf\u5dde\u8def\uff09",
          "position": {
            "lng": 104.06,
            "lat": 30.67
          }
        },
        "end": {
          "time": "222",
          "locationName": "中国上海市",
          "position": {
            "lng": 118.78,
            "lat": 32.04
          }
        }
      },
      {
        "containerId": "333",
        "start": {
          "time": "111",
          "locationName": "中国上海市",
          "position": {
            "lng": 113,
            "lat": 28.21
          }
        },
        "end": {
          "time": "222",
          "locationName": "中国上海市",
          "position": {
            "lng": 108.95,
            "lat": 34.27
          }
        }
      }
    ]
  });
})

server.post('/basicInfo', function (req, res) {
  res.json({
    "basicInfo":[
      {
        "containerId": "22932214122313",
        "containerType":"标准云箱",
        "factoryLocation":"中国-上海",
        "factory":"中集集团",
        "carrier":"中集集团",
        "factoryDate":"1495597347299"
      },
      {
        "containerId": "22932214122313",
        "containerType":"标准云箱",
        "factoryLocation":"中国-上海",
        "factory":"中集集团",
        "carrier":"中集集团",
        "factoryDate":"1495597347299"
      },
      {
        "containerId": "22932214122313",
        "containerType":"标准云箱",
        "factoryLocation":"中国-上海",
        "factory":"中集集团",
        "carrier":"中集集团",
        "factoryDate":"1495597347299"
      },
      {
        "containerId": "22932214122313",
        "containerType":"标准云箱",
        "factoryLocation":"中国-上海",
        "factory":"中集集团",
        "carrier":"中集集团",
        "factoryDate":"1495597347299"
      },
      {
        "containerId": "22932214122313",
        "containerType":"标准云箱",
        "factoryLocation":"中国-上海",
        "factory":"中集集团",
        "carrier":"中集集团",
        "factoryDate":"1495597347299"
      }
    ]
  });
})

server.post('/realtimeInfo', function (req, res) {
  res.json({
    "containerId": "111",
    "containerType": "标准云箱",
    "currentStatus": "在运",
    "carrier": "中集智能",
    "position": {
      "lng": 118.78,
      "lat":32.04
    },
    "locationName": "中国广东省深圳市龙岗区一号路 邮政编码: 518000",
    "speed": 120,
    "temperature": { value: 39, status: "正常"},
    "humidity": { value: 70, status: "正常"},
    "battery": { value: 0.6, status: "正常" },
    "boxStatus": {
      "num_of_collide": { value: 39, status: "正常"},
      "num_of_door_open": { value: 39, status: "正常"}
    }
  });
})

server.post('/newcarrier', function (req, res) {
  res.json({
    "code":"200"
  });
})

server.post('/options', function (req, res) {
  res.json({
    "alertLevel": [
      {
        "value":"option1",
        "id": 1
      },
      {
        "value":"option2",
        "id": 2
      },
      {
        "value":"option3",
        "id": 3
      }
    ],
    "alertCode": [
      {
        "value":111,
        "id": 1
      },
      {
        "value":222,
        "id": 2
      },
      {
        "value":333,
        "id": 3
      }
    ],
    "alertType": [
      {
        "value":"option1",
        "id": 1
      },
      {
        "value":"option2",
        "id": 2
      },
      {
        "value":"option3",
        "id": 3
      }
    ],
    "containerType": [
      {
        "value":"option1",
        "id": 1
      },
      {
        "value":"option2",
        "id": 2
      },
      {
        "value":"option3",
        "id": 3
      }
    ],
    "reportType": [
      {
        "value":"option1",
        "id": 1
      },
      {
        "value":"option2",
        "id": 2
      },
      {
        "value":"option3",
        "id": 3
      }
    ],
    "currentStatus": [
      {
        "value":"option1",
        "id": 1
      },
      {
        "value":"option2",
        "id": 2
      },
      {
        "value":"option3",
        "id": 3
      }
    ],
    "location": [
      {
        "value":"option1",
        "id": 1
      },
      {
        "value":"option2",
        "id": 2
      },
      {
        "value":"option3",
        "id": 3
      }
    ],
    "carrier": [
      {
        "value":"option1",
        "id": 1
      },
      {
        "value":"option2",
        "id": 2
      },
      {
        "value":"option3",
        "id": 3
      }
    ],
    "factory": [
      {
        "value":"option1",
        "id": 1
      },
      {
        "value":"option2",
        "id": 2
      },
      {
        "value":"option3",
        "id": 3
      }
    ],
    "factoryLocation": [
      {
        "value":"option1",
        "id": 1
      },
      {
        "value":"option2",
        "id": 2
      },
      {
        "value":"option3",
        "id": 3
      }
    ],
    "batteryInfo": [
      {
        "value":"option1",
        "id": 1
      },
      {
        "value":"option2",
        "id": 2
      },
      {
        "value":"option3",
        "id": 3
      }
    ],
    "hardwareInfo": [
      {
        "value":"option1",
        "id": 1
      },
      {
        "value":"option2",
        "id": 2
      },
      {
        "value":"option3",
        "id": 3
      }
    ],
    "maintenanceLocation": [
      {
        "value":"option1",
        "id": 1
      },
      {
        "value":"option2",
        "id": 2
      },
      {
        "value":"option3",
        "id": 3
      }
    ],
    "intervalTime": [
      {
        "value":"option1",
        "id": 1
      },
      {
        "value":"option2",
        "id": 2
      },
      {
        "value":"option3",
        "id": 3
      }
    ],
    "leaseType": [
      {
        "value":"长期租赁",
        "id": 1
      },
      {
        "value":"短期租赁",
        "id": 2
      }
    ]
  });
})

server.post('/basicInfoConfig', function (req, res) {
  res.json({
    "code": "OK"
  });
})

server.post('/securityConfig', function (req, res) {
  res.json({
    "code": "OK"
  });
})

server.post('/repairConfig', function (req, res) {
  res.json({
    "code": "OK"
  });
})

server.post('/issueConfig', function (req, res) {
  res.json({
    "code": "OK"
  });
})

server.post('/command', function (req, res) {
  res.json({
    "code": "OK"
  });
})

server.post('/requestlease', function (req, res) {
  res.json({
    "status": "OK",
    "containerId": "111"
  });
})

server.post('/returncontainer', function (req, res) {
  res.json({
    "status": "OK"
  });
})

server.post('/analysisresult', function (req, res) {
  res.json({
    "carrier_sales_revenue": 86230000,
    "profit_margin": 0.68,
    "carrier_orders": 34020000,
    "use_of_containers": 59270000,
    "transportation_category": {
        "airline":0.45943,
        "highway":0.20255,
        "ocean": 0.17335,
        "other": 0.16465
    },
    "goods_category": {
        "fish": 0.3,
        "beaf": 0.2,
        "chip": 0.3,
        "gold": 0.2
    },
    "history_revenue": [
        {
            "value": 3000,
            "time": "1月"
        },
        {
            "value": 2000,
            "time": "2月"
        },
        {
            "value": 7000,
            "time": "3月"
        },
        {
            "value": 3000,
            "time": "4月"
        },
        {
            "value": 3000,
            "time": "5月"
        },
        {
            "value": 3000,
            "time": "6月"
        },
        {
            "value": 3000,
            "time": "7月"
        },
        {
            "value": 3000,
            "time": "8月"
        },
        {
            "value": 3000,
            "time": "9月"
        },
        {
            "value": 6000,
            "time": "10月"
        },
        {
            "value": 2000,
            "time": "11月"
        },
        {
            "value": 4000,
            "time": "12月"
        }
    ],
    "history_profit_margin": [
        {
            "value": 0.4,
            "time": "1月"
        },
        {
            "value": 0.3,
            "time": "2月"
        },
        {
            "value": 0.7,
            "time": "3月"
        },
        {
            "value": 0.3,
            "time": "4月"
        },
        {
            "value": 0.4,
            "time": "5月"
        },
        {
            "value": 0.5,
            "time": "6月"
        },
        {
            "value": 0.4,
            "time": "7月"
        },
        {
            "value": 0.3,
            "time": "8月"
        },
        {
            "value": 0.4,
            "time": "9月"
        },
        {
            "value": 0.4,
            "time": "10月"
        },
        {
            "value": 0.2,
            "time": "11月"
        },
        {
            "value": 0.4,
            "time": "12月"
        }
    ],
    "history_orders": [
        {
            "value": 3000,
            "time": "1月"
        },
        {
            "value": 2000,
            "time": "2月"
        },
        {
            "value": 7000,
            "time": "3月"
        },
        {
            "value": 3000,
            "time": "4月"
        },
        {
            "value": 3000,
            "time": "5月"
        },
        {
            "value": 3000,
            "time": "6月"
        },
        {
            "value": 3000,
            "time": "7月"
        },
        {
            "value": 3000,
            "time": "8月"
        },
        {
            "value": 3000,
            "time": "9月"
        },
        {
            "value": 6000,
            "time": "10月"
        },
        {
            "value": 2000,
            "time": "11月"
        },
        {
            "value": 4000,
            "time": "12月"
        }
    ],
    "history_use_of_containers": [
        {
            "value": 3000,
            "time": "1月"
        },
        {
            "value": 2000,
            "time": "2月"
        },
        {
            "value": 7000,
            "time": "3月"
        },
        {
            "value": 3000,
            "time": "4月"
        },
        {
            "value": 3000,
            "time": "5月"
        },
        {
            "value": 3000,
            "time": "6月"
        },
        {
            "value": 3000,
            "time": "7月"
        },
        {
            "value": 3000,
            "time": "8月"
        },
        {
            "value": 3000,
            "time": "9月"
        },
        {
            "value": 6000,
            "time": "10月"
        },
        {
            "value": 2000,
            "time": "11月"
        },
        {
            "value": 4000,
            "time": "12月"
        }
    ]
  });
})

// server.post('/basicInfoManage', function (req, res) {
//   res.json({
//     "basicInfoConfig": [
//       {"containerId": "22937203474450"},
//       {"containerId": "22937203474450"},
//       {"containerId": "22937203474450"},
//       {"containerId": "22937203474450"},
//       {"containerId": "22937203474450"}
//     ],
//     "repairConfig": [
//       {"maintenanceLocation" : "陕西西安天谷八路"},
//       {"maintenanceLocation" : "陕西西安天谷八路"},
//       {"maintenanceLocation" : "陕西西安天谷八路"},
//       {"maintenanceLocation" : "陕西西安天谷八路"},
//       {"maintenanceLocation" : "陕西西安天谷八路"}
//     ],
//     "issueConfig": [
//       {
//         "containerType": "标准云箱",
//         "alertCode": "0x11",
//         "alertType": "失联",
//         "alertLevel": "严重故障"
//       },
//       {
//         "containerType": "标准云箱",
//         "alertCode": "0x11",
//         "alertType": "失联",
//         "alertLevel": "严重故障"
//       },
//       {
//         "containerType": "标准云箱",
//         "alertCode": "0x11",
//         "alertType": "失联",
//         "alertLevel": "严重故障"
//       }
//     ]
//   });
// })

server.use(router)
console.log('Listening at 5000')
server.listen(5000)
