(function() {

    'use strict'

    angular.module('main')
        .controller('InterviewCtrl', function($scope, $http, $uibModal, Interview) {
            var self = this
            self.getParams = function() {
                var params = {
                    page: self.iPage,
                    psize: self.iSize,
                    psorta: self.psorta
                }
                if (!!self.iClient) params.iClient = self.iClient
                if (!!self.iCandidate) params.iCandidate = self.iCandidate
                if (!!self.iType) params.iType = self.iType
                if (!!self.pSort) params.psort = self.pSort;
                return params
            }

            self.loadInterviews = function() {
                $http.get('/api/it', {
                    params: self.getParams()
                }).success(function(data) {
                    console.log(data);
                    self.it = data.it;
                    self.iCount = data.count;
                    self.ipageNumber = Math.ceil(data.count/self.getParams().psize)
                }).catch(console.error)
            }

            self.psorta = 1;

            self.showInterview = function(iid) {
                Interview.get({
                    id: iid
                }, function(it) {
                    $scope.sit = it;
                    $http.get('/api/qs', {params: {qInterview: iid, psize: -1}}).success(function(data){
                        $scope.sit.qs = data.qs;
                        $uibModal.open({
                            templateUrl: "modules/interview/interview.html",
                            size: "lg",
                            scope: $scope
                        });
                    });
                });
            }

            self.sortBy = function(pSort) {
                self.psorta *= -1;
                self.pSort = pSort;
                self.loadInterviews();
            }

            $scope.data = {
                availableOptions: 
                    [{id: '1',iSize: '5'}, 
                    {id: '2',iSize: '10'}, 
                    {id: '3',iSize: '15'},
                    {id: '4',iSize: '20'}],
                selectedOption: {
                    id: '2',
                    iSize: '10'
                } 
            };

            self.init = function() {
                self.iPage = 1
                self.iSize = self.iSize = $scope.data.selectedOption.iSize;

                $scope.$watch('data.selectedOption.iSize', function(newv, oldv){
                    if (newv == oldv) return;
                    self.iSize = newv;
                    self.loadInterviews()
                })
                $scope.$watchGroup(['interview.iClient', 'interview.iCandidate', 'interview.iType'], function(n, o) {
                    console.log('watch', n, o)
                    if (n == o) return;
                    console.log(n, o)
                    self.loadInterviews()
                })
                self.loadInterviews()
            }
            self.init();
        })
})()
