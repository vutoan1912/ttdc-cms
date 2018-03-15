(function() {
    'use strict';

    angular
        .module('erpApp')
        .factory('Scrap', Scrap);

    Scrap.$inject = ['$http'];

    function Scrap ($http) {
        var service = {
            getAll: getAll,
            create: create,
            getPage: getPage,
            getOne: getOne,
            update: update,
            deleteByListIDs: deleteByListIDs,
            activate: activate,
            deactivate: deactivate,
            listDetailsOfTransfer: listDetailsOfTransfer,
            getVnptManPnById: getVnptManPnById,
            getManPnById: getManPnById,
            getLotById: getLotById,
            getPackageById: getPackageById,
            getProductMan: getProductMan
        };

        return service;

        function getAll() {
            return $http.get('/api/scraps').then(function(response) {
                return response.data;
            });
        }
        function getOne(id) {
            return $http.get('/api/scraps/' +id).then(function (response) {
                return response.data;
            });
        }

        function getPage(params) {
            return $http.get('/api/scraps/search?' + params+ '&sort=created,desc').then(function (response) {
                return response;
            });
        }

        function create(scrap) {
            return $http.post('/api/scraps',scrap).then(function(response) {
                return response.data;
            });
        }
        function update(scrap) {
            return $http.put('/api/scraps/' + scrap.id, scrap).then(function(response) {
                return response.data;
            });
        }

        function deleteByListIDs(listIDs) {
            return $http.post('/api/scraps/batch-delete',listIDs).then(function(response) {
                return response.data;
            });
        }

        function activate(ids) {
            return $http.post('/api/scraps/activate', ids).then(function(response) {
                return response.data;
            });
        }

        function deactivate(ids) {
            return $http.post('/api/scraps/deactivate', ids).then(function(response) {
                return response.data;
            });
        }

        function listDetailsOfTransfer(id) {
            var api = '/api/transfer-details/search?query=transferId==' + id;
            return $http.get(api).then(function (response) {
                return response.data;
            });
        }

        function getVnptManPnById(id) {
            var api = 'api/product-man/'+id;
            return $http.get(api).then(function (response) {
                return response.data;
            })
        }

        function getManPnById(id) {
            var api = 'api/product-man-pn/'+id;
            return $http.get(api).then(function (response) {
                return response.data;
            })
        }

        function getLotById(id) {
            var api = 'api/lots/'+id;
            return $http.get(api).then(function (response) {
                return response.data;
            })
        }

        function getPackageById(id) {
            var api = 'api/packages/'+id;
            return $http.get(api).then(function (response) {
                return response.data;
            })
        }

        function getProductMan(productId, manId) {
            var api = 'api/product-man/search?query=manufacturerId=='+manId+';productId=='+productId;
            return $http.get(api).then(function (response) {
                return response.data[0];
            })
        }
    }
})();
