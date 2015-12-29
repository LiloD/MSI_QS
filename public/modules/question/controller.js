(function() {

    'use strict'

    angular.module('main')
        .controller('QuestionCtrl', function($scope, $http, $uibModal, $state, Interview) {
            var self = this;
            // self.co = [];
            self.getParams = function() {
                var params = {
                    page: self.qPage,
                    psize: self.qSize,
                }
                if (!!self.qQuestion) params.qQuestion = self.qQuestion
                if (!!self.qCompany) params.qCompany = self.qCompany
                return params
            }

            self.loadQuestions = function() {
                $http.get('/api/qs', {
                    params: self.getParams()
                }).success(function(data) {
                    console.log(data);
                    self.qs = data.qs;
                    self.qCount = data.count;
                }).catch(console.error)
            }

            self.newQuestions = function(interview, questions) {
                $http.post('/api/qs', {
                    interview: interview,
                    questions: questions.trim().split('\n')
                }).success(function(data) {
                    self.nq = data
                }).catch(console.error)
            }

            // self.newComments = function(comment, id){
            //     $http.post('/api/cm',{
            //         comments: comment,
            //         _id: id
            //     }).success(function(status){
            //         if(status.ok) self.co.push(comment).push(_id);

            //         // self.co = data
            //     }).catch(console.error)
            // }
            
            self.showInterview = function(q) {
                $state.transitionTo('comments', {qid: q._id});
                console.log('q:', q); 
            }

            self.init = function() {
                self.qPage = 1
                self.qSize = 10
                $scope.$watchGroup(['question.qQuestion', 'question.qCompany'], function(n, o) {
                    console.log('watch', n, o)
                    if (n == o) return;
                    console.log(n, o)
                    self.loadQuestions()
                })
                self.loadQuestions()
            }
            self.init();
        })
})()
