(function(){
	'use strict';

	angular.module('CustomFilter', [])
		.filter('cutQuestion', function(){
			return function(input){
				if(input.length > 120){
					input = input.slice(0, 117)+'...';
				}

				return input;
			}
		});
})()