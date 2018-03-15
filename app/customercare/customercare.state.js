(function(){
    'use strict';
    angular.module('erpApp')
        .config(stateConfig);
    stateConfig.$inject = ['$stateProvider']

    function stateConfig($stateProvider) {

        $stateProvider
            .state('customercare',{
                parent:'restricted',
                template:"<div ui-view></div>",
                abstract: true,
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('admin');
                        $translatePartialLoader.addPart('masterdata');
                        $translatePartialLoader.addPart('bom');
                        $translatePartialLoader.addPart('common-ui-element');
                        $translatePartialLoader.addPart('errors');
                        $translatePartialLoader.addPart('success');
                        $translatePartialLoader.addPart('global');
                        $translatePartialLoader.addPart('inventory');
                        return $translate.refresh();
                    }]
                }
            })
            .state('home',{
                parent: 'customercare',
                url: '/',
                templateUrl: 'app/customercare/customercare/customercare.html',
                controller: 'CustomerCareController',
                controllerAs: 'vm',
                data: {
                    pageTitle: 'Tra cứu chăm sóc khách hàng',
                    authorities: ['ROLE_ADMIN'], //TODO change role,
                    sideBarMenu: 'inventory'
                },
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'lazy_ionRangeSlider',
                            'lazy_tablesorter',
                            'lazy_iCheck',
                            'lazy_tree',
                            'lazy_parsleyjs',
                            'lazy_KendoUI',
                            'app/customercare/customercare/customercare.controller.js'
                        ]);
                    }]
                }
            })
            .state('cskh',{
                parent: 'customercare',
                url: '/cskh',
                templateUrl: 'app/customercare/customercare/customercare.html',
                controller: 'CustomerCareController',
                controllerAs: 'vm',
                data: {
                    pageTitle: 'Tra cứu chăm sóc khách hàng',
                    authorities: ['ROLE_ADMIN'], //TODO change role,
                    sideBarMenu: 'inventory'
                },
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'lazy_ionRangeSlider',
                            'lazy_tablesorter',
                            'lazy_iCheck',
                            'lazy_tree',
                            'lazy_parsleyjs',
                            'lazy_KendoUI',
                            'app/customercare/customercare/customercare.controller.js'
                        ]);
                    }]
                }
            })
            .state('prize',{
                parent: 'customercare',
                url: '/prize',
                templateUrl: 'app/customercare/winnings/winnings.html',
                controller: 'WinningsController',
                controllerAs: 'vm',
                data: {
                    pageTitle: 'Tra cứu chăm sóc khách hàng',
                    authorities: ['ROLE_ADMIN'], //TODO change role,
                    sideBarMenu: 'inventory'
                },
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'lazy_ionRangeSlider',
                            'lazy_tablesorter',
                            'lazy_iCheck',
                            'lazy_tree',
                            'lazy_parsleyjs',
                            'lazy_KendoUI',
                            'app/customercare/winnings/winnings.controller.js'
                        ]);
                    }]
                }
            })

    }
})();