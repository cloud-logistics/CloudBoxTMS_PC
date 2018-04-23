/**
 * Created by Otherplayer on 16/7/21.
 */
(function () {
    'use strict';

    angular.module('smart_container').controller('SiteOverviewController', SiteOverviewController);

    /** @ngInject */
    function SiteOverviewController($stateParams, constdata, ApiServer, MapService, toastr,$state,$timeout,$interval,$scope) {
        /* jshint validthis: true */
        var vm = this;

        var width = document.body.clientWidth;
        var height = document.body.clientHeight;
        var histories = [];
        var routes = [];
        vm.mapSize = {"width":width + 'px',"height":height + 'px'};
        var mapCenter = {lat: 31.2891, lng: 121.4648};

        var map = MapService.map_init("siteoverview", mapCenter, "terrain", 4);


        google.maps.event.addListener(map,"move",function(e){
            console.log("e = ",e);
        });
        var heatmap = undefined;
        $scope.site_num = undefined;

        setHeatmap();
        getOperationOverview();

        function setHeatmap(){
            ApiServer.getDistribution({
                data:"",
                success:function(res){
                    var bounds = new google.maps.LatLngBounds();
                    var histData = R.map(function(item){
                        var lng = parseFloat(item.longitude);
                        var lat = parseFloat(item.latitude);

                        var res = {
                            location: new google.maps.LatLng(lat, lng),
                            weight:  1
                        };
                        return res;
                    })(res.data.sites);

                    if(R.isEmpty(histData)){
                      toastr.error('未查询到仓库信息，请联系管理员！');
                    }else {
                        heatmap = new google.maps.visualization.HeatmapLayer({
                          data: histData,
                          radius: 20,
                          map: map
                        });

                        histData.map(function (item) {
                          bounds.extend(item.location);
                        })

                        map.fitBounds(bounds);
                    }
                },
                error:function(err){
                    console.log("获取仓库分布失败.");
                }
            })
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
