(function() {

    'use strict'

    angular.module('main')
        .controller('QuestionCtrl', function($scope, $http, $uibModal,$timeout, Interview, $q, $location, $anchorScroll) {
            var self = this;
            self.getParams = function() {
                var params = {
                    page: self.qPage,
                    psize: self.qSize,
                    psorta: self.psorta
                }
                if (!!self.qQuestion) params.qQuestion = self.qQuestion
                if (!!self.qCompany) params.qCompany = self.qCompany
                if (!!self.pSort) params.psort = self.pSort;
                return params
            }

            $scope.fetchClients = function(q){
                if(!q){
                    return [];
                }
                return $http.get('/it', { params: {query: q} });
            }

            //add question------------------------------
            $scope.questions = [];

            $scope.fetchTags =function(q){
                if(!q){
                    return [];
                }
                return ['nodejs', 'angularjs', 'expressjs'];
            }

            $scope.curQuestion = {
                description: "",
                tags:[]
            }

            $scope.reset = function(q){
                q.description = '';
                q.tags = [];
                return;
            }

            $scope.addQuestion = function(q){
                if(!q.description) return;
                $scope.questions.push(angular.copy(q));
                $scope.reset($scope.curQuestion);
            }

            $scope.removeQuestion = function(idx){
                if(idx < 0 || idx >= $scope.questions.length) return;
                $scope.questions.splice(idx, 1);
            }

            $scope.editQuestion = function(idx){
            }

            $scope.addTag = function(tag, q){
                if(!tag) return;

                console.log('tag in addTag', tag);
                if (q.tags.indexOf(tag) < 0)
                    q.tags.push(tag);
                tag = null;
                return;
            }

            $scope.removeTag = function(idx, q){
                if(idx < 0 || idx >= q.tags.length) return;
                q.tags.splice(idx, 1);
            }
            // end of add question------------------------------


            $scope.submitQuestion = function(){
                var it = {
                    Client: $scope.client,
                    Date: $scope.Date,
                    Candidate: $scope.Candidate,
                    Type: $scope.Type, 
                }

                console.log('it here', it);

                $http.post('/it', {it :it, qs: $scope.questions}).success(function(data){
                    console.log('submitQuestion', data);
                })
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

            self.psorta = 1;
            self.showInterview = function(q) {
                $scope.sq = q;
                $uibModal.open({
                    templateUrl: "modules/question/question.html",
                    size: "lg",
                    scope: $scope
                });
<<<<<<< HEAD
            }

            self.sortBy = function(pSort) {
                self.psorta *= -1;
                self.pSort = pSort;
                self.loadQuestions();
=======
>>>>>>> newInterview
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
