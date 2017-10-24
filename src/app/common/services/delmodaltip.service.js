/**
 * Created by Otherplayer on 2016/11/16.
 */

(function() {
	'use strict';

    /**
     * 删除弹出框tip: delmodaltip
     *
     */
    angular
        .module('smart_container')
        .factory('delmodaltip', delmodaltip);

    /** @ngInject */
    function delmodaltip(i18n) {
    	var tip = {
    		title: '删除',
    		content: '确定要删除吗？'
    	}

    	return tip;
    }
})();