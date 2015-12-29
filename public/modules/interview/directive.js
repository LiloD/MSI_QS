(function() {

    'use strict'

    angular.module('interview')
        .directive('interviewPanel', function() {
            return {
                templateUrl: '/modules/interview/list.html',
                controller: function($scope, $http, $uibModal, Interview) {
                    $scope.getParams = function() {
                        var params = {
                            page: $scope.iPage,
                            psize: $scope.iSize,
                            psorta: $scope.psorta
                        }
                        if (!!$scope.iClient) params.iClient = $scope.iClient
                        if (!!$scope.iCandidate) params.iCandidate = $scope.iCandidate
                        if (!!$scope.iType) params.iType = $scope.iType
                        if (!!$scope.pSort) params.psort = $scope.pSort;
                        return params
                    }

                    $scope.loadInterviews = function() {
                        $http.get('/api/it', {
                            params: $scope.getParams()
                        }).success(function(data) {
                            console.log(data);
                            $scope.it = data.it;
                            $scope.iCount = data.count;
                        }).catch(console.error)
                    }

                    $scope.psorta = 1;

                    $scope.showInterview = function(iid) {
                        Interview.get({
                            id: iid
                        }, function(it) {
                            $scope.sit = it;
                            $http.get('/api/qs', {
                                params: {
                                    qInterview: iid,
                                    psize: -1
                                }
                            }).success(function(data) {
                                $scope.sit.qs = data.qs;
                                $uibModal.open({
                                    templateUrl: "modules/interview/interview.html",
                                    size: "lg",
                                    scope: $scope
                                });
                            });
                        });
                    }

                    $scope.sortBy = function(pSort) {
                        $scope.psorta *= -1;
                        $scope.pSort = pSort;
                        $scope.loadInterviews();
                    }

                    $scope.init = function() {
                        $scope.iPage = 1
                        $scope.iSize = 10
                        $scope.$watchGroup(['interview.iClient', 'interview.iCandidate', 'interview.iType'], function(n, o) {
                            console.log('watch: ', n, o)
                            if (n == o) return;
                            console.log(n, o)
                            $scope.loadInterviews()
                        })
                        $scope.loadInterviews()
                    }
                    $scope.init();
                }
            };
        })
})();
