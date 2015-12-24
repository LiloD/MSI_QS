(function() {

    'use strict'

    //login service

    angular.module('login', ['ui.bootstrap', 'ngMessages'])
        .factory('LoginService', function($http, $rootScope) {
            var EVENT_LOGIN = 'login success';
            var EVENT_LOGOUT = 'logout success';
            var baseUrl = '/users'
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
                        console.log('info in check', info);
                        if (info && info.user) $rootScope.$broadcast(EVENT_LOGIN, info)
                    })
                },
                login: function(usr, pwd) {
                    console.log('here!');
                    $http.post(baseUrl + '/login', {
                        username: usr,
                        password: pwd
                    }).success(function(info) {
                        console.log('user in login', info);
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
                checkUsername: function(username){
                    console.log('in service checkUsername', username);
                    return $http.get(baseUrl+'/checkusername', {
                        params: {"username" : username}
                    }).success(function(data){
                        if(data.ok){
                            return true;
                        }
                        return false;
                    });
                },
                EVENT_LOGIN: EVENT_LOGIN
            };
        })
})()