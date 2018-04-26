/**
 * Created by Otherplayer on 16/7/21.
 */
(function () {
    'use strict';

    angular.module('smart_container').controller('SiteOverviewController', SiteOverviewController);

    /** @ngInject */
    function SiteOverviewController($stateParams, NetworkService,constdata, ApiServer, MapService, toastr,$state,$timeout,$interval,$scope) {
        /* jshint validthis: true */
        var vm = this;


 

        var width = document.body.clientWidth;
        var height = document.body.clientHeight;
        var histories = [];
        var routes = [];
       
        vm.mapSize = {"width":width + 'px',"height":height + 'px'};
        var mapCenter = {lat: 31.2891, lng: 121.4648};

        //put warehouse detail  by cwl
        vm.displayedWarehouse = [];
        vm.getBasePath =  'rentservice/site/list/province/0/city/0';


      

        var map = MapService.map_init("siteoverview", mapCenter ,"terrain", 4);
        google.maps.event.addListener(map,"move",function(e){
            console.log("e = ",e);
        });

        var heatmap = undefined;
        $scope.site_num = undefined;

        vm.getDatas = getDatas();


        vm.searchWarehouse = '';
        vm.displayedSearchWarehouse=[];
        vm.goSearch = goSearch;

        vm.goResetSearch = function(){
            
            vm.goSearch();

        }



        function goSearch() {
           
         
            
            var j =0 ;
            
            for(var i=0; i< vm.displayedWarehouse.length; i++){
                
               var L = vm.displayedWarehouse[i].location.length;
              
               var warehouseLocation =  String( vm.displayedWarehouse[i].location );
               
                var n = warehouseLocation.search(vm.searchWarehouse);
               
                if( n>=0 & n<L){
                    
                    
                    vm.displayedSearchWarehouse[j]=vm.displayedWarehouse[i];
                   
                    j++;
                    
                }else{
                    continue;
                }

            }

            if(j>0){

                 //var mapCenter1 = {lat:vm.displayedSearchWarehouse[0].latitude, lng: vm.displayedSearchWarehouse[0].longitude};
                 // alert(mapCenter1.lat);
                var myCenter1 = new google.maps.LatLng(vm.displayedSearchWarehouse[0].latitude,vm.displayedSearchWarehouse[0].longitude);
                 map.setCenter(myCenter1,8);
                 //map.panTo(mapCenter1, 6);
                  
                
                   
                
                
                //map = MapService.map_init("siteoverview", mapCenter1 ,"terrain", 6);
                //alert( vm.displayedSearchWarehouse[0].longitude);
                //vm.displaySites();
                    
            }else{

                alert("没有该仓库");
            }

        };













        vm.displaySites = function(){
            
            var infowindow = new google.maps.InfoWindow();
            var marker, i;
            for (i = 0; i < vm.displayedWarehouse.length; i++) {

                marker = new google.maps.Marker({
                    position: new google.maps.LatLng(vm.displayedWarehouse[i].latitude, vm.displayedWarehouse[i].longitude),
                    icon:"http://ozv4m1lo0.bkt.clouddn.com/assets/images/icon_warehouse_bd.svg",
                    map: map
                });


            
               google.maps.event.addListener(marker, 'mouseover', (function (marker, i) {
                    return function () {
                        var displayedWarehouseAddress = vm.displayedWarehouse[i].location.length > 15 ? vm.displayedWarehouse[i].location.substr(2,6):vm.displayedWarehouse[i].location;
                     
                       
                        var content = '<div ng-click="goDetail(vm.displayedWarehouse[i])"  style="color:black;text-align:center;width:250px; height: 100px;">'+
                        '<strong>'+ displayedWarehouseAddress+ vm.displayedWarehouse[i].name+'</strong>'+

                            '<div>'+ 
                                '<div>'+vm.displayedWarehouse[i].allCurrentBoxInfo.availableNum + '/' +vm.displayedWarehouse[i].allCurrentBoxInfo.allNum+
                                '</div>'+

                                '<div>'+
                               " 可用／总数"+
                                '</div>'+

                            '</div>' +

                            '<div id="address">'+

                            vm.displayedWarehouse[i].location+
                            '</div>'+     

                        '</div>';

                        infowindow.setContent( content);
                        infowindow.open(map, marker);
                    }
                })(marker, i));



                google.maps.event.addListener(marker, 'click', (function (marker,i) {
                    return function(){  
                        goDetail(vm.displayedWarehouse[i]);
                     }
                     
                 })(marker,i));
            }     
        };


        function getDatas() {
                 
                NetworkService.get(vm.getBasePath, {
                    limit: vm.limit
                }, function (response) {               
                    if(response.data.results != null && response.data.results.length > 0){
                        vm.showEmpty = false;
                    }else{
                        vm.showEmpty = true;
                        vm.showEmptyInfo = '暂无仓库信息';

                    }
                    vm.processDatas(response);
                
                    //vm.displayedCollection = [].concat(vm.items);
                }, function (response) {
                    toastr.error(response.statusText);
                });      
        };

        vm.processDatas = function (response){
            vm.items = response.data.results;
            if(vm.items.length > 0) {
                for (var i = 0; i < vm.items.length; i++) {

                    //var allNum = 0;
                    vm.items[i].freezerBoxInfo  = {
                        availableNum:0,
                        allNum:0
                    };
                    vm.items[i].coolerBoxInfo = {
                        availableNum:0,
                        allNum:0
                    };
                    vm.items[i].medicalBoxInfo = {
                        availableNum:0,
                        allNum:0
                    };
                    vm.items[i].ordinaryBoxInfo = {
                        availableNum:0,
                        allNum:0
                    };
                    vm.items[i].specialBoxInfo = {
                        availableNum:0,
                        allNum:0
                    };
                    vm.items[i].allCurrentBoxInfo = {
                        availableNum:0,
                        allNum:0
                    };

                    if(vm.items[i].box_num != null && vm.items[i].box_num.length > 0) {
                    for (var j = 0; j < vm.items[i].box_num.length; j++) {
                        vm.items[i].allCurrentBoxInfo.allNum += vm.items[i].box_num[j].ava_num;
                        vm.items[i].allCurrentBoxInfo.availableNum += vm.items[i].box_num[j].ava_num - vm.items[i].box_num[j].reserve_num;
                    }
                    $scope.site_num= vm.items.length;                 
                }
                }
            }
            vm.displayedWarehouse = (vm.items);

            vm.displaySites();

        };



        function goDetail(item) {
            $state.go('app.edit_warehouse',{username:item.id, args:{type:'detail'}});

        };


     









     


        function getOperationOverview(){
          ApiServer.getOperationOverview(function (response) {
              $scope.site_num = response.data.site_num;
          }, function (err) {
              console.log("Get getOperationOverview  Info Failed", err);
          });
        }
        $scope.$on("mapResize_from_main_to_children",function(){
           setTimeout(function(){
                google.maps.event.trigger(map, 'resize')
            },100);
        })
    }


})();
