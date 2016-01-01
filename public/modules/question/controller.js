(function() {

    'use strict';

    angular.module('main')
        .controller('QuestionCtrl', function($scope, $http, $uibModal, Interview, $state) {
	       $scope.questionInfoPopover = {
            content: 'Hello, World!',
            templateUrl: 'questionPopover.html',
            title: 'Title'
          };

           var self = this;
            self.getParams = function() {
                var params = {
                    page: self.qPage,
                    psize: self.qSize,
                    psorta: self.psorta
                }
                if (!!self.qQuestion) params.qQuestion = self.qQuestion;
                if (!!self.qCompany) params.qCompany = self.qCompany;
                if (!!self.pSort) params.psort = self.pSort;
                return params;
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
            
            self.showInterview = function(q) {
                console.log('q:', q);
                $state.go('questionDetail', {qid: q._id});
            }
            self.psorta = -1;
            

            self.sortBy = function(pSort) {
                self.psorta *= -1;
                self.pSort = pSort;
                self.loadQuestions();
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
        .controller('QuestionDetailCtl', ['$scope', '$state', '$http', 'LoginService', '$stateParams', function($scope, $state, $http, LoginService, $stateParams){
            console.log('$stateParams', $stateParams);
            if(!$stateParams.qid){
                $state.go('question');
                return;
            }

            $scope.comments = [];

            $scope.loadQuestion = function(qid){
                console.log('in!');
                $http.get('/qs/'+qid).success(function(data){
                    console.log('data', data);
                    if(data.ok){
                        $scope.q = data.q;
                        $scope.updateComments($scope.q._id);
                    }else{
                        console.log("can't get question with id", qid);
                    }
                })
            }

            $scope.newComment = function(comment, qid){
                console.log("comment", comment);
                console.log("qid", qid);
                console.log("username", LoginService.getUser() && LoginService.getUser().user);
                $http.post('/api/cm',{
                    comment: comment,
                    _id: qid,
                    username: LoginService.getUser() && LoginService.getUser().user
                })
                .success(function(res){
                    $scope.comments.push({
                        username: LoginService.getUser().user,
                        comment: comment
                    })  
                });
            }

            $scope.updateComments = function(qid){
                console.log("update comments");
                console.log("qid", qid);
                $http.get('/api/cm', { params: {qid: qid} })
                    .success(function(data){
                        console.log('comments', data);
                        $scope.comments = data
                })
            }

            $scope.loadQuestion($stateParams.qid);

        }])
        .controller('NewInterviewCtl', ['$scope', '$state', '$http', function($scope, $state, $http){

            $scope.fetchClients = function(q){
                if(!q){
                    return [];
                }
                return $http.get('/it', { params: {query: q} });
            }

            //add question------------------------------
            $scope.questions = [];

            // $scope.fetchTags =function(q){
            //     if(!q){
            //         return [];
            //     }
            //     return ['nodejs', 'angularjs', 'expressjs'];
            // }
            
            $scope.fetchTags =function(q){
                if(!q){
                    return [];
                }
                return $http.get('/api/tag', { params: {query: q} });
            }

            $scope.curQuestion = {
                question: "",
                tags:[]
            }

            $scope.reset = function(q){
                q.question = '';
                q.tags = [];
                return;
            }

            $scope.addQuestion = function(q){
                if(!q.question) return;
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

                $http.post('/it', {it :it, qs: $scope.questions}).success(function(data){
                    // console.log('submitQuestion', data);
                    $scope.insertSuccess = true;
                    //reset
                    $scope.Candidate = null;
                    $scope.Type = null;
                    $scope.Date = null;
                    $scope.client = null;
                    $scope.questions = [];
                    $scope.curQuestion = {
                        question: "",
                        tags:[]
                    }
                })
            }
        }])
})()
