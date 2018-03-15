(function() {
    'use strict';

    angular
        .module('erpApp')
        .factory('Uom', Uom);

    Uom.$inject = ['$http'];

    function Uom ($http) {
        var service = {
            getAll: getAll,
            create: create,
            getByPage: getByPage,
            getUomById: getUomById,
            update: update,
            deleteByListIDs: deleteByListIDs,
            getUomByCategoryId: getUomByCategoryId,
            activateByListIDs: activateByListIDs,
            deactivateByListIDs: deactivateByListIDs,
            deleteById: deleteById,
        };

        return service;

        function getAll() {
            return $http.get('/api/uom').then(function(response) {
                return response.data;
            });
        }

        function create(uom) {
            return $http.post('/api/uom',uom).then(function(response) {
                return response.data;
            });
        }

        function getByPage(params) {
            return $http.get('/api/uom/search?' +params + '&sort=id,desc').then(function (response) {
                return response;
            });
        }

        function getUomById(id) {
            return $http.get('/api/uom/' + id).then(function(response) {
                return response.data;
            });
        }

        function update(uom) {
            return $http.put('/api/uom/' + uom.id, uom).then(function(response) {
                return response.data;
            });
        }

        function deleteByListIDs(listIDs) {
            return $http.post('/api/uom/batch-delete',listIDs).then(function(response) {
                return response.data;
            });
        }

        function getUomByCategoryId(categoryId) {
            return $http.get('/api/uom/search?query=categoryId==' +categoryId).then(function (response) {
                return response.data;
            });
        }

        function activateByListIDs(listIDs) {
            return $http.post('/api/uom/activate',listIDs).then(function(response) {
                return response.data;
            });
        }

        function deactivateByListIDs(listIDs) {
            return $http.post('/api/uom/deactivate',listIDs).then(function(response) {
                return response.data;
            });
        }

        function deleteById(id) {
            return $http.delete('/api/uom/'+id).then(function(response) {
                return response.data;
            });
        }

    }
})();
