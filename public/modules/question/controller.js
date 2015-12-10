(function() {

    'use strict'

    angular.module('main')
        .controller('QuestionCtrl', function($scope, $http, $uibModal,$timeout, Interview, $q, $location, $anchorScroll) {
            var self = this;
            self.getParams = function() {
                var params = {
                    page: self.qPage,
                    psize: self.qSize,
                }
                if (!!self.qQuestion) params.qQuestion = self.qQuestion
                if (!!self.qCompany) params.qCompany = self.qCompany
                return params
            }


            $scope.info = {
                q : '',
                fetch : function(q, hints){
                    if(!q){
                        return [];
                    }
                    return $http.get('/it', { params: {query: q} });
                } 
            }

            //add question------------------------------
            $scope.questions = [];

            $scope.tagInfo = {
                q : '',
                fetch : function(q, hints){
                    if(!q){
                        return [];
                    }
                    return ['nodejs', 'angularjs', 'expressjs'];
                } 
            }

            $scope.curQuestion = {
                description: "",
                tags:[]
            }

            $scope.reset = function(){
                $scope.curQuestion.description = '';
                $scope.curQuestion.tags = [];
                $scope.tagInfo.q = '';
            }

            $scope.addQuestion = function(q){
                if(!q.description) return;
                $scope.questions.push(angular.copy(q));
                $scope.reset();


                $timeout(function() {
                    console.log("scroll!!");
                    $location.hash('newQuestions');
                    $anchorScroll();
                });
            }

            $scope.removeQuestion = function(idx){
                if(idx < 0 || idx >= $scope.questions.length) return;
                $scope.questions.splice(idx, 1);
            }

            $scope.editQuestion = function(idx){
                $scope.curQuestion = $scope.questions[idx];
                $scope.removeQuestion(idx);
            }

            $scope.addTag = function(tag){
                if(!tag) return;
                if($scope.curQuestion.tags.indexOf(tag) < 0)
                    $scope.curQuestion.tags.push(tag);   
            }

            $scope.removeTag = function(idx){
                if(idx < 0 || idx >= $scope.curQuestion.tags.length) return;
                $scope.curQuestion.tags.splice(idx, 1);
            }
            // end of add question------------------------------




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

            self.showInterview = function(iid) {
                self.showInterviewDetail = Interview.get({
                    id: iid
                });
                // $uibModal.open({
                //     template: ""
                // })
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
