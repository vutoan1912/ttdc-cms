(function() {
    'use strict';

    angular
        .module('erpApp')
        .factory('Transfer', Transfer);

    Transfer.$inject = ['$http'];

    function Transfer ($http) {
        var service = {
            getAll: getAll,
            create: create,
            getPage: getPage,
            getOne: getOne,
            update:update,
            deleteRecord:deleteRecord,
            deleteOne:deleteOne,
            activate:activate,
            deactivate:deactivate,
            getTestData:getTestData,
            getOrigins:getOrigins,
            getOperationTab: getOperationTab,
            getOperationDetailTab: getOperationDetailTab,
            validate:validate,
            cancelTransfer: cancelTransfer,
            returnTransfer:returnTransfer,
            checkAvailability:checkAvailability,
            unReserve:unReserve,
            getMOItems:getMOItems
        };

        return service;

        function getAll() {
            return $http.get('/api/transfers').then(function(response) {
                return response.data;
            });
        }
        function getOperationTab(params) {
            return $http.get('/api/transfer-items/search?' + params).then(function(response) {
                return response;
            });
        }
        function getOperationDetailTab(params) {
            return $http.get('/api/transfer-details/search?' + params).then(function(response) {
                return response;
            });
        }

        function create(tf) {
            return $http.post('/api/transfers',tf).then(function(response) {
                return response.data;
            });
        }

        function getOne(id) {
            return $http.get('/api/transfers/' +id).then(function (response) {
                return response.data;
            });
        }

        function getPage(params) {
            return $http.get('/api/transfers/search?' + params).then(function (response) {
                return response;
            });
        }

        function update(tf) {
            return $http.put('/api/transfers/' + tf.id, tf).then(function(response) {
                return response.data;
            });
        }

        function deleteRecord(ids) {
            return $http.post('/api/transfers/batch-delete', ids).then(function(response) {
                return response.data;
            });
        }

        function deleteOne(id){
            return $http.delete('/api/transfers/'+ id).then(function(response) {
                return response.data;
            });
        }

        function activate(ids) {
            return $http.post('/api/transfers/activate', ids).then(function(response) {
                return response.data;
            });
        }

        function deactivate(ids) {
            return $http.post('/api/transfers/deactivate', ids).then(function(response) {
                return response.data;
            });
        }

        function getOrigins(params) {
            var url = '/api/transfers/search?query=expression=="groupBy==originTransferNumber;orderBy==id,desc"'
            if(params !=''){
                url += ";" +params
            }
            url +="&size=1000"
            return $http.get(url).then(function(response) {
                return response;
            });
        }

        function validate(id,createBackorder,autoSetDoneQuantity) {
            return $http.post('/api/transfers/' + id + '/validate?createBackorder='+createBackorder + '&autoSetDoneQuantity=' +autoSetDoneQuantity).then(function(response) {
                    return response;
            });
        }

        function getTestData() {
            var transfers = {
                serverFiltering: true,
                transport: {
                    read: {
                        url: "test_data/transfers.json"
                    }
                }
            };
            return transfers
        }

        function cancelTransfer(transfer) {
            var api = '/api/transfers/cancel';
            return $http.post(api, transfer).then(function (response) {
                return response.data;
            })
        }

        function returnTransfer(id,transfer) {
            return $http.post('/api/transfers/' + id + '/return',transfer).then(function(response) {
                return response;
            });
        }

        function checkAvailability(id) {
            return $http.post('/api/transfers/' +id +'/check-availability').then(function (response) {
                return response.data;
            });
        }

        function unReserve(id) {
            return $http.post('/api/transfers/' +id +'/unreserve').then(function (response) {
                return response.data;
            });
        }

        function getMOItems(id) {
            return $http.get('/api/transfers/' +id +'/mo-items').then(function (response) {
                return response.data;
            });
        }
    }
})();
