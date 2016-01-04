(function() {

    'use strict'

    angular.module('interview')
        .directive('interviewPanel', function() {
            return {
                templateUrl: '/modules/interview/list.html',
                controller: function($scope, $http, $uibModal, Interview, $state, $stateParams) {
                    
                    $scope.searchPopover = {
                        templateUrl: 'searchPopover.html'
                    };

                    var reloadCurrent = function(){    
                        $state.transitionTo($state.current, uriEncode($stateParams), { 
                          reload: true, inherit: false, notify: true 
                        });
                    }

                    var uriEncode = function(obj){
                        for(var property in obj){
                            if(!!obj[property]) obj[property] = encodeURIComponent(obj[property]);
                        }

                        return obj;
                    }

                    var uriDecode = function(obj){
                        for(var property in obj){
                            if(!!obj[property]) obj[property] = decodeURIComponent(obj[property]);
                        }
                        return obj;
                    }

                    $scope.advancedSearch = function(company, candidate, type, befored, afterd){
                        $stateParams = {};
                        $stateParams.iClient = company;
                        $stateParams.iCandidate = candidate;
                        $stateParams.iType = type;
                        $stateParams.befored = befored;
                        $stateParams.afterd = afterd;

                        console.log("advanced search stateParams",$stateParams)
                        reloadCurrent();
                    }

                    $scope.showQuestion = function(q){
                        $state.go('questionDetail', {qid: q._id});
                    }

                    $scope.loadInterviews = function() {
                        console.log('in loadInterviews stateParams', $stateParams);
                        $http.get('/api/it', {
                            params: uriDecode($stateParams)
                        }).success(function(data) {
                            console.log(data);
                            $scope.it = data.it;
                            $scope.iCount = data.count;
                        }).catch(console.error)
                    }

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
                        console.log('in sortBy', pSort);
                        console.log('in sortBy psorta', $stateParams.psorta);
                        if(!$stateParams.psorta) $stateParams.psorta = -1;
                        $stateParams.psorta = parseInt($stateParams.psorta)*-1;
                        $stateParams.pSort = pSort;
                        console.log('in sortBy psorta', $stateParams.psorta);
                        console.log('in sortBy stateParams', $stateParams);
                        reloadCurrent();
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
                        console.log('loadInterviews init!');
                        $scope.iPage = 1;
                        $scope.iSize = self.iSize = $scope.data.selectedOption.iSize;

                        $stateParams.page = $stateParams.page || 1;
                        $stateParams.psize = $stateParams.psize || 10;
                        $stateParams.psorta = $stateParams.psorta || -1;

                        console.log('in init stateParams', $stateParams);
                        $scope.loadInterviews();
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
