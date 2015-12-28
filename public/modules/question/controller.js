(function() {

    'use strict'

    angular.module('main')
        .controller('QuestionCtrl', function($scope, $http, $uibModal, Interview) {
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

            self.loadQuestions = function() {
                $http.get('/api/qs', {
                    params: self.getParams()
                }).success(function(data) {
                    console.log(data);
                    self.qs = data.qs;
                    self.qCount = data.count;
                    self.qpageNumber = Math.ceil(data.count/self.getParams().psize);
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
            }

            self.sortBy = function(pSort) {
                self.psorta *= -1;
                self.pSort = pSort;
                self.loadQuestions();
            }

            $scope.data = {
                availableOptions: 
                    [{id: '1',qSize: '5'}, 
                    {id: '2',qSize: '10'},
                    {id: '3',qSize: '15'}, 
                    {id: '4',qSize: '20'}],
                selectedOption: {
                    id: '2',
                    qSize: '10'
                } 
            };

            self.init = function() {
                self.qPage = 1
                self.qSize = $scope.data.selectedOption.qSize;

                $scope.$watch('data.selectedOption.qSize', function(newv, oldv){
                    if (newv == oldv) return;
                    self.qSize = newv;
                    self.loadQuestions()
                })

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
