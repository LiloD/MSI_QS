(function(){
	angular.module('main')
		.directive('questionDetail', function(){
			return {
				restrict:'E',
				scope:{
					q: '=data'
				},
				templateUrl:'/modules/question/detail.html',
				controller: [function(){
					
				}],
				link: function(scope, element, attr){
					console.log(scope.q);
					console.log('question detail create success');
				}
			};
		})

})()