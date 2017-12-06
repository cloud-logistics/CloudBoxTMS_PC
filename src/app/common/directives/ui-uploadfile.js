(function () {
    'use strict';
    angular.module('smart_container').directive( "fileModel", [ "$parse", function( $parse ){
        return {
            restrict: "A",
            link: function( scope, element, attrs ){
                var model = $parse( attrs.fileModel );
                var modelSetter = model.assign;

                element.bind( "change", function(){
                    scope.$apply( function(){
                        element[0].files[0].viewName = element[0].files[0].name.length > 15 ? '...'+element[0].files[0].name.substr(element[0].files[0].name.length-15,15):element[0].files[0].name;
                        modelSetter( scope, element[0].files[0] );
                         console.log( element[0].files[0] );

                    } )
                } )
            }
        }
    }])

})();



