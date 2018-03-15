(function() {
    'use strict';

    angular
        .module('erpApp')
        .factory('Supplier', Supplier);

    Supplier.$inject = ['$http'];

    function Supplier ($http) {
        var service = {
            current : current,
            getAll: getAll,
            getPage: getPage,
            getOneModel: getOneModel,
            getAllMv: getAllMv,
            handleAfterReload: handleAfterReload,
            getPageManOfSupp: getPageManOfSupp,
            idSup: 0,
            getAllManOfSup : getAllManOfSup
        };

        return service;

        function current() {
            return $http.get('/api/users/current').then(function(response) {
                return response.data;
            });
        }

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
            return $http.get('/api/companies/search?' + params+'&type==sup').then(function (response) {
                return response;
            });
        }

        function handleAfterReload(data, paramMore) {
            var list_data = data;
            for(var i = 0;i<list_data.length;i++){
                var man_tmp =  getMans(list_data[i],paramMore.name,paramMore.id);
                list_data[i]['man_tmp'] = man_tmp;
            }
            console.log(list_data);
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
        function getMans(product, supName, supId){
            var manTable=[];
            var productName = product.name;
            var manWithCode = JSON.parse(product.manWithCode);
            var manNames = JSON.parse(product.manIdMap);
            var suppliers = JSON.parse(product.manWithSuppliers);
            var manWithPns = JSON.parse(product.manWithPns);
            var list_man_id = [];

            for (var key in suppliers) {
                var man_sup_tmp = suppliers[key];
                if(man_sup_tmp.length > 0){
                    for (var key1 in man_sup_tmp) {
                        if(man_sup_tmp[key1] == supName){
                            list_man_id.push(key);
                        }
                    }
                }

            }
            var list_man_name = [];
            var rowspan = 0;
            for(var i =0;i< list_man_id.length;i++){
                var name_tmp = getManName(list_man_id[i],manNames);
                var manPNArray = manWithPns[list_man_id[i]];
                if (manPNArray[0]){
                    rowspan = rowspan + manPNArray.length;
                }else{
                    if(manPNArray[0]==''){
                        rowspan = rowspan+1;
                    }else{
                        rowspan = 1;
                    }

                }
                var tmp ={
                    "manPN": manPNArray,
                    "manNameChild":name_tmp
                }
                list_man_name.push(tmp);
            }

            var dict ={
                "manName":list_man_name,
                "rowSpan":rowspan,
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
        function getPageManOfSupp(params) {
            return $http.get('/api/companies/'+service.idSup+'/man?' + params).then(function (response) {
                return response;
            });
        }
        function getAllManOfSup(id) {
            return $http.get('/api/companies/'+id+'/man').then(function (response) {
                return response.data;
            });
        }
    }
})();
