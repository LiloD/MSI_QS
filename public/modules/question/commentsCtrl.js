(function(){
	'use strict'

	angular.module('main')
        .controller('CommentsCtrl', function($scope, $http, $state, Interview) {
        	var self = this;
        	self.co = [];

        	self.newComments = function(comment, id){
                $http.post('/api/cm',{
                    comments: comment,
                    _id: id
                }).success(function(status){
                    if(status.ok) self.co.push(comment).push(_id);

                    // self.co = data
                }).catch(console.error)
            }

            

        })
})()