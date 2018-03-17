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
            .state('register',{
                parent: 'customercare',
                url: "/register",
                templateUrl: 'app/customercare/register/register.html',
                controller: 'RegisterController',
                controllerAs: 'vm',
                data: {
                    pageTitle: 'Tra cứu đăng ký / hủy',
                    authorities: ['ROLE_ADMIN'], //TODO change role,
                    sideBarMenu: 'inventory'
                },
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'lazy_ionRangeSlider',
                            'lazy_tablesorter',
                            'lazy_iCheck',
                            'lazy_parsleyjs',
                            'lazy_KendoUI',
                            'app/customercare/register/register.controller.js'
                        ]);
                    }]
                }
            })
            .state('momt',{
                parent: 'customercare',
                url: "/momt",
                templateUrl: 'app/customercare/momt/momt.html',
                controller: 'MOMTController',
                controllerAs: 'vm',
                data: {
                    pageTitle: 'Tra cứu MO/MT',
                    authorities: ['ROLE_ADMIN'], //TODO change role,
                    sideBarMenu: 'inventory'
                },
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'lazy_ionRangeSlider',
                            'lazy_tablesorter',
                            'lazy_iCheck',
                            'lazy_parsleyjs',
                            'lazy_KendoUI',
                            'app/customercare/momt/momt.controller.js'
                        ]);
                    }]
                }
            })
            .state('charge',{
                parent: 'customercare',
                url: "/charge",
                templateUrl: 'app/customercare/charge/charge.html',
                controller: 'ChargeController',
                controllerAs: 'vm',
                data: {
                    pageTitle: 'Tra cứu trừ cước',
                    authorities: ['ROLE_ADMIN'], //TODO change role,
                    sideBarMenu: 'inventory'
                },
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'lazy_ionRangeSlider',
                            'lazy_tablesorter',
                            'lazy_iCheck',
                            'lazy_parsleyjs',
                            'lazy_KendoUI',
                            'app/customercare/charge/charge.controller.js'
                        ]);
                    }]
                }
            })
            .state('sub',{
                parent: 'customercare',
                url: "/sub",
                templateUrl: 'app/customercare/sub/sub.html',
                controller: 'SubController',
                controllerAs: 'vm',
                data: {
                    pageTitle: 'Tra cứu thông tin thuê bao',
                    authorities: ['ROLE_ADMIN'], //TODO change role,
                    sideBarMenu: 'inventory'
                },
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'lazy_ionRangeSlider',
                            'lazy_tablesorter',
                            'lazy_iCheck',
                            'lazy_parsleyjs',
                            'lazy_KendoUI',
                            'app/customercare/sub/sub.controller.js'
                        ]);
                    }]
                }
            })
    }
})();