(function() {

    'use strict'

    angular.module('login', ['ui.bootstrap', 'ngMessages'])
        .factory('LoginService', function($http, $rootScope) {
            var EVENT_LOGIN = 'login success';
            var EVENT_LOGOUT = 'logout success';
            var baseUrl = '/passport'
            return {
                logout: function() {
                    console.log('log out')
                    $http.get(baseUrl + '/logout').success(function(info) {
                        console.log('log out', info)
                        $rootScope.$broadcast(EVENT_LOGOUT, info)
                    })
                },
                check: function() {
                    return $http.get(baseUrl + '/check').success(function(info) {
                        if (info && info.usr) $rootScope.$broadcast(EVENT_LOGIN, info)
                    })
                },
                login: function(usr, pwd) {
                    $http.post(baseUrl + '/login', {
                        username: usr,
                        password: pwd
                    }).success(function(info) {
                        $rootScope.$broadcast(EVENT_LOGIN, info)
                    });
                },
                sign: function(usr, pwd) {
                    $http.post(baseUrl + '/sign', {
                        username: usr,
                        password: pwd
                    }).success(function() {
                        $rootScope.$broadcast(EVENT_LOGIN, {
                            usr: usr
                        })
                    })
                },
                EVENT_LOGIN: EVENT_LOGIN
            };
        })
})()