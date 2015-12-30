(function(){
	'use strict'
	angular.module('main')
        // .directive('commentsCtrl', function(LoginService) {
        //     return {
        //         templateUrl: '/modules/question/comments.html',
        //         controller: function($scope) {
        //         	$scope.co = [];

		      //   	$scope.newComments = function(comment, id){
		      //   		console.log("_id:",id)
		      //           $http.post('/api/cm',{
		      //               comments: comment,
		      //               qid: id
		      //           }).success(function(status){
		      //               if(status.ok) self.co.push(comment).push(qid);

		      //               // self.co = data
		      //           }).catch(console.error)
		      //       }    
                    
        //         }
        //     };
        // })
        .controller('CommentsCtrl', function($scope, $stateParams){
        	console.log($stateParams)
        })


	// angular.module('main')
 //        .controller('CommentsCtrl', function($scope, $http, $state, Interview) {
 //        	var self = this;
 //        	self.co = [];

 //        	self.newComments = function(comment, id){
 //        		console.log("_id:",id)
 //                $http.post('/api/cm',{
 //                    comments: comment,
 //                    qid: id
 //                }).success(function(status){
 //                    if(status.ok) self.co.push(comment).push(qid);

 //                    // self.co = data
 //                }).catch(console.error)
 //            }

            

        // })
})()