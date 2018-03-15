(function() {
    'use strict';

    angular
        .module('erpApp')
        .factory('Manufacturer', Manufacturer);

    Manufacturer.$inject = ['$http'];

    function Manufacturer ($http) {
        var service = {
            getAll: getAll,
            getPage: getPage,
            getOneModel: getOneModel,
            getAllMv: getAllMv,
            handleAfterReload: handleAfterReload,
            getPageSupOfMan: getPageSupOfMan,
            idMan: 0,
            getAllSupOfMan : getAllSupOfMan
        };

        return service;

        function getAll() {
            return $http.get('/api/companies').then(function(response) {
                return response.data;
            });
        }
        function getOneModel(id) {
            return $http.get('/api/companies/search?query=id==' +id).then(function (response) {
                return response.data;
            });
        }

        function getPage(params) {
            return $http.get('/api/companies/search?' + params).then(function (response) {
                return response;
            });
        }

        function handleAfterReload(data, paramMore) {
            var list_data = data;
            for(var i = 0;i<list_data.length;i++){
                var man_tmp =  getMans(list_data[i],paramMore.name,paramMore.id);
                list_data[i]['man_tmp'] = man_tmp;
            }
            return list_data;
        }

        function getAllMv(params) {
           // return $http.get('/api/products/advanced-search?query=name==*KBQLESMX000001*;manIdMap=="*:48}*"').then(function (response) {
           //  return $http.get('/api/products/advanced-search?query=manNames=="*'+name+'*"').then(function (response) {
           //      return response.data;
           //  });
            return $http.get('/api/products/advanced-search?'+params).then(function (response) {
                return response;
            });
        }
        function getMans(product, manName, manId){
            var manTable=[]
            var productName = product.name;
            var manWithCode = JSON.parse(product.manWithCode);
            var manNames = JSON.parse(product.manIdMap);
            var suppliers = JSON.parse(product.manWithSuppliers);
            var manWithPns = JSON.parse(product.manWithPns);
            for (var key in manWithCode) {
                if(key == manId){
                    if (manWithCode.hasOwnProperty(key)) {
                        var manPNArray = manWithPns[key]
                        var supArray = suppliers[key]
                        var rowspan =1;
                        if (supArray[0]){
                            rowspan = supArray.length
                        }

                        var vnptMan = productName+manWithCode[key]
                        var dict ={
                            "rowspan":rowspan,
                            "vnptMan": vnptMan,
                            "manName":getManName(key,manNames),
                            "manPN":'',
                            "suplier":[""]
                        }

                        if ( manPNArray[0]) {
                            dict['manPN'] = manPNArray
                        }

                        if (supArray[0]) {
                            dict['suplier'] = supArray
                        }
                        // manTable.push(dict)


                    }

                }
            }
            return dict
        }

        function getManName(value,manNames) {
            for (var key in manNames) {
                if (manNames.hasOwnProperty(key)) {
                    if(manNames[key] == value){
                        return key
                    }
                }
            }
        }

        function getPageSupOfMan(params) {
            return $http.get('/api/companies/'+service.idMan+'/suppliers?' + params).then(function (response) {
                return response;
            });
        }
        function getAllSupOfMan(id) {
            return $http.get('/api/companies/'+id+'/suppliers').then(function (response) {
                return response.data;
            });
        }


    }
})();
