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

                    $scope.psorta = -1;

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

                    $scope.data = {
                        availableOptions: [{
                            id: '1',
                            iSize: '5'
                        }, {
                            id: '2',
                            iSize: '10'
                        }, {
                            id: '3',
                            iSize: '15'
                        }, {
                            id: '4',
                            iSize: '20'
                        }],
                        selectedOption: {
                            id: '2',
                            iSize: '10'
                        }
                    };


                    $scope.init = function() {
                        $scope.iPage = 1
                        $scope.iSize = self.iSize = $scope.data.selectedOption.iSize;

                        $scope.$watch('data.selectedOption.iSize', function(newv, oldv) {
                            if (newv == oldv) return;
                            $scope.iSize = newv;
                            $scope.loadInterviews()
                        })

                        $scope.$watchGroup(['iClient', 'iCandidate', 'iType'], function(n, o) {
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
        .directive('interviewDetail', function() {
            return {

            }
        })
})();
