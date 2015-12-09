(function() {

    'use strict'

    angular.module('main')
        .controller('InterviewCtrl', function($scope, $http, $uibModal, Interview) {
            var self = this
            self.getParams = function() {
                var params = {
                    page: self.iPage,
                    psize: self.iSize,
                }
                if (!!self.iClient) params.iClient = self.iClient
                if (!!self.iCandidate) params.iCandidate = self.iCandidate
                if (!!self.iType) params.iType = self.iType
                if (!!self.iDate) params.iDate = self.iDate
                return params
            }

            self.loadInterviews = function() {
                $http.get('/api/it', {
                    params: self.getParams()
                }).success(function(data) {
                    console.log(data);
                    self.it = data.it;
                    self.iCount = data.count;
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
                self.iPage = 1
                self.iSize = 10
                $scope.$watchGroup(['interview.iClient', 'interview.iCandidate', 'interview.iType', 'interview.iDate'], function(n, o) {
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
