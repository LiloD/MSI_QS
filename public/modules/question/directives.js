(function(){
	angular.module('main')
		.directive('questionDetail', function(){
			return {
				restrict:'E',
				scope:{
					q: '=data'
				},
				templateUrl:'/modules/question/detail.html'
			};
		})
})()