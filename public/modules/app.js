(function() {

    'use strict'

    angular.module('main', ['ui.bootstrap', 'ui.router', 'ngResource', 'login', 'interview', 'hint', 'ngAnimate'])
        .config(function($stateProvider, $urlRouterProvider, $locationProvider) {
            // remove hash
            $locationProvider.html5Mode(true);

            // set default router
            $urlRouterProvider.otherwise('/question')

            // provide router
            $stateProvider
                .state('question', {
                    url: '/question',
                    templateUrl: 'modules/question/list.html',
                    controller: 'QuestionCtrl as question'
                })
                .state('new', {
                    url: '/new',
                    templateUrl: 'modules/question/new.html',
                    controller: 'NewInterviewCtl'
                })
                .state('interview', {
                    url: '/interview',
                    template: '<interview-panel></interview-panel>',
                })
                .state('newUser', {
                    url: '/user/new',
                    templateUrl: 'modules/login/new.html',
                    controller: 'SignCtl'
                })
                .state('questionDetail', {
                    url: '/question/detail',
                    templateUrl: 'modules/question/question.html',
                    controller: 'QuestionDetailCtl',
                    data: {
                        q: null
                    }
                })
                .state('comments', {
                    url: '/comments/:qid',
                    templateUrl: 'modules/comments/comments.html',
                    controller: 'CommentsCtrl as comments'
                })
                
            // add resource

        })
        .factory('Interview', function($resource) {
            return $resource('/api/it/:id', {
                id: '@id'
            }, {
                get: {
                    method: 'GET',
                    params: {
                        id: '@id'
                    }
                }
            })
        })
})()
