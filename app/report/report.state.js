(function(){
    'use strict';
    angular.module('erpApp')
        .config(stateConfig);
    stateConfig.$inject = ['$stateProvider']

    function stateConfig($stateProvider) {

        $stateProvider
            .state('report',{
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
            .state('revenue-day',{
                parent: 'report',
                url: "/revenue-day",
                templateUrl: 'app/report/revenueday/revenueday.html',
                controller: 'RevenueDayController',
                controllerAs: 'vm',
                data: {
                    pageTitle: 'Thống kê doanh thu ngày',
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
                            'app/report/revenueday/revenueday.controller.js'
                        ]);
                    }]
                }
            })
            .state('revenue-week',{
                parent: 'report',
                url: "/revenue-week",
                templateUrl: 'app/report/revenueweek/revenueweek.html',
                controller: 'RevenueWeekController',
                controllerAs: 'vm',
                data: {
                    pageTitle: 'Thống kê doanh thu tuần',
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
                            'app/report/revenueweek/revenueweek.controller.js'
                        ]);
                    }]
                }
            })
            .state('revenue-month',{
                parent: 'report',
                url: "/revenue-month",
                templateUrl: 'app/report/revenuemonth/revenuemonth.html',
                controller: 'RevenueMonthController',
                controllerAs: 'vm',
                data: {
                    pageTitle: 'Thống kê doanh thu tháng',
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
                            'app/report/revenuemonth/revenuemonth.controller.js'
                        ]);
                    }]
                }
            })
            .state('revenue-year',{
                parent: 'report',
                url: "/revenue-year",
                templateUrl: 'app/report/revenueyear/revenueyear.html',
                controller: 'RevenueYearController',
                controllerAs: 'vm',
                data: {
                    pageTitle: 'Thống kê doanh thu năm',
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
                            'app/report/revenueyear/revenueyear.controller.js'
                        ]);
                    }]
                }
            })
    }
})();