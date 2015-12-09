(function() {

    'use strict'

    angular.module('login')
        .directive('loginForm', function(LoginService) {
            return {
                templateUrl: '/modules/login/form.html',
                controller: function($scope) {
                    $scope.$on(LoginService.EVENT_LOGIN, function(e, info) {
                        console.log('login finish', info)
                        $scope.msg = info.msg;
                    })
                    $scope.login = function(usr, pwd) {
                        LoginService.login(usr, pwd);
                    }

                    $scope.sign = function(usr, pwd) {
                        LoginService.sign(usr, pwd);
                    }
                }
            };
        })
        .directive('loginNav', function() {
            return {
                templateUrl: '/modules/login/nav.html',
                controller: function($uibModal, $scope, $log, LoginService) {
                    $scope.$on(LoginService.EVENT_LOGIN, function(e, info) {
                        console.log('login finish', info)
                        $scope.usr = info.usr;
                    })

                    $scope.open = function() {
                        var modalInstance = $uibModal.open({
                            animation: $scope.animationsEnabled,
                            template: '<login-form></login-form>',
                            resolve: {}
                        });

                        $scope.$on(LoginService.EVENT_LOGIN, function(e, info) {
                            !!info.usr && modalInstance.close();
                        })
                    }

                    $scope.logout = function() {
                        $scope.usr = undefined;
                        LoginService.logout()
                    }

                    LoginService.check()
                },
                link: function(scope) {
                    scope.$on('$destroy', function() {
                        // TODO
                    });
                }
            }
        })

})();