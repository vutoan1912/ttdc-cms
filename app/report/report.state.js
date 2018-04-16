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
            .state('revenue-quarter',{
                parent: 'report',
                url: "/revenue-quarter",
                templateUrl: 'app/report/revenuequarter/revenuequarter.html',
                controller: 'RevenueQuarterController',
                controllerAs: 'vm',
                data: {
                    pageTitle: 'Thống kê doanh thu quý',
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
                            'app/report/revenuequarter/revenuequarter.controller.js'
                        ]);
                    }]
                }
            })
            .state('revenue-renewal',{
                parent: 'report',
                url: "/revenue-renewal",
                templateUrl: 'app/report/revenuerenewal/revenuerenewal.html',
                controller: 'RevenueRenewalController',
                controllerAs: 'vm',
                data: {
                    pageTitle: 'Thống kê doanh thu gia hạn',
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
                            'app/report/revenuerenewal/revenuerenewal.controller.js'
                        ]);
                    }]
                }
            })
            .state('revenue-register',{
                parent: 'report',
                url: "/revenue-register",
                templateUrl: 'app/report/revenueregister/revenueregister.html',
                controller: 'RevenueRegisterController',
                controllerAs: 'vm',
                data: {
                    pageTitle: 'Thống kê doanh thu đăng ký',
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
                            'app/report/revenueregister/revenueregister.controller.js'
                        ]);
                    }]
                }
            })
            .state('output-day',{
                parent: 'report',
                url: "/output-day",
                templateUrl: 'app/report/outputday/outputday.html',
                controller: 'OutputDayController',
                controllerAs: 'vm',
                data: {
                    pageTitle: 'Thống kê sản lượng theo ngày',
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
                            'app/report/outputday/outputday.controller.js'
                        ]);
                    }]
                }
            })
            .state('output-month',{
                parent: 'report',
                url: "/output-month",
                templateUrl: 'app/report/outputmonth/outputmonth.html',
                controller: 'OutputMonthController',
                controllerAs: 'vm',
                data: {
                    pageTitle: 'Thống kê sản lượng theo tháng',
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
                            'app/report/outputmonth/outputmonth.controller.js'
                        ]);
                    }]
                }
            })
            .state('output-sub',{
                parent: 'report',
                url: "/output-sub",
                templateUrl: 'app/report/outputsub/outputsub.html',
                controller: 'OutputSubController',
                controllerAs: 'vm',
                data: {
                    pageTitle: 'Thống kê sản lượng theo thuê bao',
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
                            'app/report/outputsub/outputsub.controller.js'
                        ]);
                    }]
                }
            })
            .state('revenue-day-cp',{
                parent: 'report',
                url: "/revenue-day-cp",
                templateUrl: 'app/report/revenuedaycp/revenueday-cp.html',
                controller: 'RevenueDayCPController',
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
                            'app/report/revenuedaycp/revenueday-cp.controller.js'
                        ]);
                    }]
                }
            })
            .state('output-day-cp',{
                parent: 'report',
                url: "/output-day-cp",
                templateUrl: 'app/report/outputdaycp/outputday-cp.html',
                controller: 'OutputDayCPController',
                controllerAs: 'vm',
                data: {
                    pageTitle: 'Thống kê sản lượng theo ngày',
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
                            'app/report/outputdaycp/outputday-cp.controller.js'
                        ]);
                    }]
                }
            })
            .state('revenue-register-cp',{
                parent: 'report',
                url: "/revenue-register-cp",
                templateUrl: 'app/report/revenueregistercp/revenueregister-cp.html',
                controller: 'RevenueRegisterCPController',
                controllerAs: 'vm',
                data: {
                    pageTitle: 'Thống kê doanh thu đăng ký',
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
                            'app/report/revenueregistercp/revenueregister-cp.controller.js'
                        ]);
                    }]
                }
            })
            .state('revenue-renewal-cp',{
                parent: 'report',
                url: "/revenue-renewal-cp",
                templateUrl: 'app/report/revenuerenewalcp/revenuerenewal-cp.html',
                controller: 'RevenueRenewalCPController',
                controllerAs: 'vm',
                data: {
                    pageTitle: 'Thống kê doanh thu gia hạn',
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
                            'app/report/revenuerenewalcp/revenuerenewal-cp.controller.js'
                        ]);
                    }]
                }
            })
            .state('revenue-week-cp',{
                parent: 'report',
                url: "/revenue-week-cp",
                templateUrl: 'app/report/revenueweekcp/revenueweek-cp.html',
                controller: 'RevenueWeekCPController',
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
                            'app/report/revenueweekcp/revenueweek-cp.controller.js'
                        ]);
                    }]
                }
            })
            .state('revenue-quarter-cp',{
                parent: 'report',
                url: "/revenue-quarter-cp",
                templateUrl: 'app/report/revenuequartercp/revenuequarter-cp.html',
                controller: 'RevenueQuarterCPController',
                controllerAs: 'vm',
                data: {
                    pageTitle: 'Thống kê doanh thu quý',
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
                            'app/report/revenuequartercp/revenuequarter-cp.controller.js'
                        ]);
                    }]
                }
            })
            .state('revenue-year-cp',{
                parent: 'report',
                url: "/revenue-year-cp",
                templateUrl: 'app/report/revenueyearcp/revenueyear-cp.html',
                controller: 'RevenueYearCPController',
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
                            'app/report/revenueyearcp/revenueyear-cp.controller.js'
                        ]);
                    }]
                }
            })
            .state('revenue-month-cp',{
                parent: 'report',
                url: "/revenue-month-cp",
                templateUrl: 'app/report/revenuemonthcp/revenuemonth-cp.html',
                controller: 'RevenueMonthCPController',
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
                            'app/report/revenuemonthcp/revenuemonth-cp.controller.js'
                        ]);
                    }]
                }
            })
    }
})();