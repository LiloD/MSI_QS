(function() {
    'use strict'
    angular.module('interview', [])
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
