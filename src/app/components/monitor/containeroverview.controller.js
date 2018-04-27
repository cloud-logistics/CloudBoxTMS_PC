/**
 * Created by Otherplayer on 16/7/21.
 */
(function () {
    'use strict';

    angular.module('smart_container').controller('ContainerOverviewController', ContainerOverviewController);

    /** @ngInject */
    function ContainerOverviewController($stateParams, constdata, NetworkService, ApiServer, MapService, toastr, $state, $timeout, $interval, $scope) {
        /* jshint validthis: true */
        var vm = this;

        var width = document.body.clientWidth;
        var height = document.body.clientHeight;
        var histories = [];
        var routes = [];
        vm.mapSize = {"width": width + 'px', "height": height + 'px'};
        var mapCenter = {lat: 31.2891, lng: 121.4648};

        var map = MapService.map_init("containeroverview", mapCenter, "terrain", 4);
        google.maps.event.addListener(map,"move",function(e){
            console.log("e = ",e);
        });

        var heatmap = undefined;

        vm.getBasePath =  'rentservice/boxinfo/query';

       vm.getBoxDetail = 'rentservice/boxinfo/detail/';

        vm.displayedCollection=[];

        vm.displayBoxeDetail=[];

    

        $scope.validationCheck = function () {
            $scope.isContainerIdInvalida = vm.queryParams.containerId != "" && !constdata['validation']['id'].test(vm.queryParams.containerId);
        };

        // 鼠标绘图工具
        $scope.container_num = undefined;
    
        //getHistorylocationInfo();
        //getOperationOverview();
        vm.getDatas = getDatas();
        //vm.goSearch = goSearch();

        vm.enterEvent = function(e){
            var keycode = window.event?e.keyCode:e.which;
            if(keycode==13){
                vm.goResetSearch();
            }
        }

        vm.goResetSearch = function(){
            
             goSearch();
           

        }


        function goSearch() {   
            
            for(var i=0 ; i< vm.displayedCollection.length; i++){
                //alert(vm.displayBoxeDetail[i].box_info.deviceid);
             if( vm.searchbox == vm.displayedCollection[i].deviceid){

                
                //vm.displayBoxeDetail[i].location.latitude, vm.displayBoxeDetail[i].location.longitude
                var myCenter2 = new google.maps.LatLng(vm.displayBoxeDetail[i].location.latitude, vm.displayBoxeDetail[i].location.longitude);
                NetworkService.get(vm.getBoxDetail + '/' + vm.displayedCollection[i].deviceid,null,function (response){

                    var myCenter1 = new google.maps.LatLng(response.data.location.latitude, response.data.location.latitude);
                }, function(response){

                    toastr.error("搜索错误！")
                });
   
                
                map.setCenter(myCenter2);
                map.setZoom(8);
                    
                 }else if (i<vm.displayedCollection.length){
                  continue;
               
                 }else{
                  toastr.error("没有对应仓库！");
                 }


        }

        };




















        function getDatas() {

                
                NetworkService.post(vm.getBasePath , {
                    "province_id": 0,
                    "city_id": 0,
                    "site_id": 0,
                    "ava_flag": "",
                    "box_id": ""

                }, function (response) {
                     
                    vm.items = response.data.results;
                    if(vm.items != null && vm.items.length > 0){
                        vm.showEmpty = false;
                    }else{
                        vm.showEmpty = true;
                        vm.showEmptyInfo = '暂无云箱信息';
                    }

                    if (vm.items.length > 0) {
                        for (var i = 0; i < vm.items.length; i++) {

                            vm.items[i].curStatus = 1;
                            if (vm.items[i].rent_status == 0) {
                                vm.items[i].curStatus = 1;
                            } else if (vm.items[i].rent_status == 1) {
                                vm.items[i].curStatus = 2;
                            } else if (vm.items[i].rent_status == 2) {
                                vm.items[i].curStatus = 3;
                            }
                        }
                    }
                    
                    vm.displayedCollection = (vm.items);
                    $scope.container_num=vm.displayedCollection.length;
                    vm.getDetail();
                  
                }, function (response) {
                    
                    vm.showMainSpinner = false;
                    toastr.error(response.statusText);
                });
         }
         


         vm.getDetail = function(){

            for(var i=0; i<vm.displayedCollection.length; i++){

                NetworkService.get(vm.getBoxDetail + '/' + vm.displayedCollection[i].deviceid,null,function (response) {
                    vm.user = response.data;
                    var disPoint,point;

                
                    vm.user.curStatus = 1;
                    if(vm.user.box_info.rent_status == 0){
                        vm.user.curStatus = 1;
                    }else if(vm.user.box_info.rent_status == 1){
                        vm.user.curStatus = 2;
                    }else if(vm.user.box_info.rent_status == 2){
                        vm.user.curStatus = 3;
                    }
                   
                    
                    vm.displayBoxeDetail.push(vm.user);

                    if( vm.displayBoxeDetail.length == vm.displayedCollection.length){
                       
                     vm.displayBoxes();
                    }

                },function(response){
                    toastr.error(response.statusText);
                });
               
            }       

         }




      

         vm.displayBoxes = function(){
            
            var infowindow = new google.maps.InfoWindow();
            var marker, i;

           
         
            for (i = 0; i < vm.displayBoxeDetail.length; i++) {
              
                marker = new google.maps.Marker({
                    position: new google.maps.LatLng(vm.displayBoxeDetail[i].location.latitude, vm.displayBoxeDetail[i].location.longitude),
                    icon:"http://ozv4m1lo0.bkt.clouddn.com/assets/images/box_overlay.svg",
                    map: map
                });

               
            
             google.maps.event.addListener(marker, 'mouseover', (function (marker, i) {
                    return function () {
                        var displayedBoxId = vm.displayedCollection[i].deviceid;
                       // alert(displayedBoxId%2);
                       var isShowCoolbox = "";
                        var isShowFreezebox = "";

                      if( i%2 == 0){
                            isShowCoolbox =  "display: none";
                        } else{
                            isShowFreezebox = "display: none";
                        } 
 
                     
                       
                        var content = '<div class="marker-title "  style=" height:100px;  text-align:left "  >'+

                                        '<div class="marker-title-header " style="color:black; text-align:left">'+
                                        '<strong style="font-size:14px ">'+ "云箱详情： ID"+ displayedBoxId+'</strong>'+
                                        '</div>'+

                                        '<div class="marker-box-type " style=" margin: 5px 5px; width:220px; height:50px;">'+ 
                                           
                                        '<div  style="' +  isShowCoolbox +         '">'+
                                                '<div class="marker-cold-box-containeroverview  inline" >'+      
                                                '<strong>' +"冷藏云箱"+'</strong>'+
                                                '</div>'+
                                             
                                                '<div class="marker-box-number inline"  style="font-size: 14px; "  >'+
                                                 '<span style= " color:black; font-size:14px; " >'+ '<strong>'+"派送中" +'</strong>'+'</span>' +
                                                 '<span style= " color:green; font-size:10px; " >'+'<strong>'+"正常"+ '<strong>'+'</span>'+'<br/>'+
                                                " 温度： -8"+
                                                '</div>'+
                        
                                        '</div>'+
                                            
                                        '<div style="' +  isShowFreezebox +         '">'+
                                                '<div class="marker-freeze-box-containeroverview  inline">'+
                                                '<strong>' +"冷冻云箱"+'</strong>'+
                                                '</div>'+
                                                '<div class="marker-box-number inline"  style="font-size: 14px; "  >'+ 
                                                '<span style= " color:black; font-size:14px; " >'+ '<strong>'+"库存中"+'<strong>' +'</span>' +
                                                '<span style= " color:red; font-size:10px; " >'+'<strong>'+"异常"+ '<strong>'+'</span>'+'<br/>'+
                                                " 温度： 0"+
                                                '</div>'+
                                            '</div>'+
                                            
                                      '</div>' +

                                      '<div>'+
                                      '<strong style="font-size:10px ">'+  "租户信息： 北京市麻辣诱惑食品有限公司"+'</strong>'+
                                      '</div>'+                        
                        '</div>';   

                       

                        infowindow.setContent( content);
                        infowindow.open(map, marker);
                    }
                })(marker, i));  



                google.maps.event.addListener(marker, 'click', (function (marker,i) {
                    return function(){  
                        vm.goDetail(vm.displayedCollection[i]);
                     }
                     
                 })(marker,i)); 
            }    

         }



         vm.goDetail= function(item) {
            $state.go('app.edit_boxbasic',{username:item.deviceid, args:{type:'detail', data:item}});

        };








        

      /*  function getOperationOverview() {
            ApiServer.getOperationOverview(function (response) {
            
                $scope.container_num = response.data.container_num;
            }, function (err) {
                console.log("Get getOperationOverview  Info Failed", err);
            });
        } */

        $scope.$on("mapResize_from_main_to_children", function () {
            console.log("mapResize in children", map);
            setTimeout(function () {
                google.maps.event.trigger(map, 'resize')
            }, 100);
        })
    } 

})();
