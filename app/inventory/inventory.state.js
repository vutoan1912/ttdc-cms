(function(){
    'use strict';
    angular.module('erpApp')
        .config(stateConfig);
    stateConfig.$inject = ['$stateProvider']

    function stateConfig($stateProvider) {

        $stateProvider
            .state('inventory',{
                parent:'restricted',
                template:"<div ui-view></div>",
                abstract: true,
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('admin');
                        $translatePartialLoader.addPart('inventory');
                        $translatePartialLoader.addPart('masterdata');
                        $translatePartialLoader.addPart('location');
                        $translatePartialLoader.addPart('route');
                        $translatePartialLoader.addPart('warehouse');
                        $translatePartialLoader.addPart('transfer');
                        $translatePartialLoader.addPart('scrap');
                        $translatePartialLoader.addPart('common-ui-element');
                        $translatePartialLoader.addPart('errors');
                        $translatePartialLoader.addPart('success');
                        $translatePartialLoader.addPart('global');
                        return $translate.refresh();
                    }]
                }
            })
            .state('warehouses',{
                parent: 'inventory',
                url: '/warehouses',
                templateUrl: 'app/inventory/warehouse/warehouse.html',
                controller: 'WarehouseController',
                controllerAs: 'vm',
                data: {
                    pageTitle: 'warehouse.common.Warehouse',
                    authorities: ['ROLE_ADMIN'], //TODO change role,
                    sideBarMenu: 'inventory'
                },
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'lazy_ionRangeSlider',
                            'lazy_tablesorter',
                            'lazy_iCheck',
                            'lazy_KendoUI',
                            'app/inventory/warehouse/warehouse.controller.js'
                        ]);
                    }]
                }
            })
            .state('warehouses-detail',{
                parent: 'warehouses',
                url: "/{warehouseId:[0-9]{1,4}}/details",
                templateUrl: 'app/inventory/warehouse/warehouse.detail.html',
                controller: 'WarehouseController',
                controllerAs: 'vm',
                data: {
                    pageTitle: 'warehouse.common.Detail',
                    authorities: ['ROLE_ADMIN'], //TODO change role,
                    sideBarMenu: 'inventory'
                },
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'lazy_ionRangeSlider',
                            'lazy_tablesorter',
                            'lazy_iCheck',
                            'app/inventory/warehouse/warehouse.controller.js'
                        ]);
                    }]
                }
            })
            .state('warehouses-create',{
                parent: 'warehouses',
                url: "/create",
                templateUrl: 'app/inventory/warehouse/warehouse.create.html',
                controller: 'WarehouseController',
                controllerAs: 'vm',
                data: {
                    pageTitle: 'warehouse.common.Create',
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
                            'app/inventory/warehouse/warehouse.controller.js'
                        ]);
                    }]
                }
            })
            .state('warehouses-edit',{
                parent: 'warehouses',
                url: "/{warehouseId:[0-9]{1,4}}/edit",
                templateUrl: 'app/inventory/warehouse/warehouse.edit.html',
                controller: 'WarehouseController',
                controllerAs: 'vm',
                data: {
                    pageTitle: 'warehouse.common.Edit',
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
                            'app/inventory/warehouse/warehouse.controller.js'
                        ]);
                    }]
                }
            })
            .state('sequences',{
                parent: 'inventory',
                url: '/sequences',
                templateUrl: 'app/inventory/sequences/sequences.html',
                controller: 'SequenceHomeController',
                controllerAs: 'vm',
                data: {
                    pageTitle: 'inventory.common.Sequences',
                    authorities: ['ROLE_ADMIN'], //TODO change role,
                    sideBarMenu: 'inventory'
                },
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'lazy_ionRangeSlider',
                            'lazy_tablesorter',
                            'lazy_iCheck',
                            'lazy_KendoUI',
                            'app/inventory/sequences/sequences.home.controller.js'
                        ]);
                    }]
                }
            })
            .state('sequences-detail',{
                parent: 'sequences',
                url: "/{sequenceId:[0-9]{1,4}}/details",
                templateUrl: 'app/inventory/sequences/sequences.detail.html',
                controller: 'SequenceController',
                controllerAs: 'vm',
                data: {
                    pageTitle: 'inventory.common.Sequence',
                    authorities: ['ROLE_ADMIN'], //TODO change role,
                    sideBarMenu: 'inventory'
                },
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'lazy_ionRangeSlider',
                            'lazy_tablesorter',
                            'lazy_iCheck',
                            'app/inventory/sequences/sequences.controller.js'
                        ]);
                    }]
                }
            })
            .state('sequences-create',{
                parent: 'sequences',
                url: "/create",
                templateUrl: 'app/inventory/sequences/sequences.create.html',
                controller: 'SequenceController',
                controllerAs: 'vm',
                data: {
                    pageTitle: 'inventory.common.Sequence',
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
                            'app/inventory/sequences/sequences.controller.js'
                        ]);
                    }]
                }
            })
            .state('sequences-edit',{
                parent: 'sequences',
                url: "/{sequenceId:[0-9]{1,4}}/edit",
                templateUrl: 'app/inventory/sequences/sequences.edit.html',
                controller: 'SequenceController',
                controllerAs: 'vm',
                data: {
                    pageTitle: 'inventory.common.Sequence',
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
                            'app/inventory/sequences/sequences.controller.js'
                        ]);
                    }]
                }
            })
            .state('locations',{
                parent: 'inventory',
                url: '/locations',
                templateUrl: 'app/inventory/locations/list_location.html',
                controller: 'ListLocationController',
                controllerAs: 'vm',
                data: {
                    pageTitle: 'List Location',
                    displayName: 'List Location',
                    authorities: ['ROLE_ADMIN'], //TODO change role,
                    sideBarMenu: 'inventory'
                },
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'lazy_ionRangeSlider',
                            'lazy_tablesorter',
                            'lazy_iCheck',
                            'lazy_KendoUI',
                            'app/inventory/locations/list_location.controller.js'
                        ]);
                    }]
                }
            })
            .state('locations.detail',{
                parent: 'locations',
                url: "/details?id",
                templateUrl: 'app/inventory/locations/location.detail.html',
                controller: 'ListLocationController',
                controllerAs: 'vm',
                data: {
                    pageTitle: 'Location Detail',
                    displayName: 'Location Detail',
                    authorities: ['ROLE_ADMIN'], //TODO change role,
                    sideBarMenu: 'inventory'
                },
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'lazy_ionRangeSlider',
                            'lazy_tablesorter',
                            'lazy_iCheck',
                            'app/inventory/locations/list_location.controller.js'
                        ]);
                    }]
                }
            })
            .state('locations.create',{
                parent: 'locations',
                url: '/create/{type}',
                templateUrl: 'app/inventory/locations/location.create.html',
                controller: 'FormLocationController',
                controllerAs: 'vm',
                data: {
                    pageTitle: 'List Location',
                    displayName: 'List Location',
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
                            'app/inventory/locations/form_location.controller.js'
                        ]);
                    }]
                }
            })
            .state('locations.edit',{
                parent: 'locations',
                url: '/edit?id',
                templateUrl: 'app/inventory/locations/location.create.html',
                controller: 'FormLocationController',
                controllerAs: 'vm',
                data: {
                    pageTitle: 'List Location',
                    displayName: 'List Location',
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
                            'app/inventory/locations/form_location.controller.js'
                        ]);
                    }]
                }
            })
            .state('operation-types',{
                parent: 'inventory',
                url: '/operation-types',
                templateUrl: 'app/inventory/operation-types/operation_types.html',
                controller: 'OperationTypesHomeController',
                controllerAs: 'vm',
                data: {
                    pageTitle: 'inventory.common.ots',
                    authorities: ['ROLE_ADMIN'], //TODO change role,
                    sideBarMenu: 'inventory'
                },
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'lazy_ionRangeSlider',
                            'lazy_tablesorter',
                            'lazy_iCheck',
                            'lazy_KendoUI',
                            'app/inventory/operation-types/operation_types.home.controller.js'
                        ]);
                    }]
                }
            })
            .state('operation-types-detail',{
                parent: 'operation-types',
                url: "/{otId:[0-9]{1,4}}/details",
                templateUrl: 'app/inventory/operation-types/operation_types.detail.html',
                controller: 'OperationTypesController',
                controllerAs: 'vm',
                data: {
                    pageTitle: 'inventory.common.ots',
                    authorities: ['ROLE_ADMIN'], //TODO change role,
                    sideBarMenu: 'inventory'
                },
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'lazy_ionRangeSlider',
                            'lazy_tablesorter',
                            'lazy_iCheck',
                            'app/inventory/operation-types/operation_types.controller.js'
                        ]);
                    }]
                }
            })
            .state('operation-types-create',{
                parent: 'operation-types',
                url: "/create",
                templateUrl: 'app/inventory/operation-types/operation_types.create.html',
                controller: 'OperationTypesController',
                controllerAs: 'vm',
                data: {
                    pageTitle: 'inventory.common.ots',
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
                            'app/inventory/operation-types/operation_types.controller.js'
                        ]);
                    }]
                }
            })
            .state('operation-types-edit',{
                parent: 'operation-types',
                url: "/{otId:[0-9]{1,4}}/edit",
                templateUrl: 'app/inventory/operation-types/operation_types.edit.html',
                controller: 'OperationTypesController',
                controllerAs: 'vm',
                data: {
                    pageTitle: 'inventory.common.ots',
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
                            'app/inventory/operation-types/operation_types.controller.js'
                        ]);
                    }]
                }
            })


            //STATE FOR ROUTES
            .state('routes',{
                parent: 'inventory',
                url: '/routes',
                templateUrl: 'app/inventory/routes/routes.html',
                controller: 'RouteController',
                controllerAs: 'vm',
                data: {
                    pageTitle: 'Route',
                    displayName: 'Route',
                    authorities: ['ROLE_ADMIN'], //TODO change role,
                    sideBarMenu: 'inventory'
                },
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'lazy_ionRangeSlider',
                            'lazy_tablesorter',
                            'lazy_iCheck',
                            'lazy_KendoUI',
                            'app/inventory/routes/routes.controller.js'
                        ]);
                    }]
                }
            })
            //ROUTE FOR WAREHOUSE LINK
            .state('routes-warehouse',{
                parent: 'inventory',
                url: '/routes-warehouse?list_id',
                templateUrl: 'app/inventory/routes/routes.warehouse.html',
                controller: 'RouteWarehouseController',
                controllerAs: 'vm',
                data: {
                    pageTitle: 'Route',
                    displayName: 'Route',
                    authorities: ['ROLE_ADMIN'], //TODO change role,
                    sideBarMenu: 'inventory'
                },
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'lazy_ionRangeSlider',
                            'lazy_tablesorter',
                            'lazy_iCheck',
                            'lazy_KendoUI',
                            'app/inventory/routes/routes.warehouse.controller.js'
                        ]);
                    }]
                }
            })
            .state('routes-create',{
                parent: 'routes',
                url: '/create',
                templateUrl: 'app/inventory/routes/routes.create.html',
                controller: 'CreateRouteController',
                controllerAs: 'vm',
                data: {
                    pageTitle: 'Create Route',
                    displayName: 'Create Route',
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
                            'app/inventory/routes/routes.create.controller.js'
                        ]);
                    }]
                }
            })
            .state('routes-detail',{
                parent: 'routes',
                url: '/{routeId:[0-9]{1,4}}/details',
                templateUrl: 'app/inventory/routes/routes.detail.html',
                controller: 'DetailRouteController',
                controllerAs: 'vm',
                data: {
                    pageTitle: 'Detail Route',
                    displayName: 'Detail Route',
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
                            'app/inventory/routes/routes.detail.controller.js'
                        ]);
                    }]
                }
            })
            .state('routes-edit',{
                parent: 'routes',
                url: '/{routeId:[0-9]{1,4}}/edit',
                templateUrl: 'app/inventory/routes/routes.edit.html',
                controller: 'EditRouteController',
                controllerAs: 'vm',
                data: {
                    pageTitle: 'Edit Route',
                    displayName: 'Edit Route',
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
                            'app/inventory/routes/routes.edit.controller.js'
                        ]);
                    }]
                }
            })
            //STATE FOR SCRAPS
            .state('scraps',{
                parent: 'inventory',
                url: '/scraps/{transferId:[0-9]{1,12}}',
                templateUrl: 'app/inventory/scrap/scraps.html',
                controller: 'ScrapController',
                controllerAs: 'vm',
                data: {
                    pageTitle: 'Scrap',
                    displayName: 'Scrap',
                    authorities: ['ROLE_ADMIN'], //TODO change role,
                    sideBarMenu: 'inventory'
                },
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'lazy_ionRangeSlider',
                            'lazy_tablesorter',
                            'lazy_iCheck',
                            'lazy_KendoUI',
                            'app/inventory/scrap/scraps.controller.js'
                        ]);
                    }]
                }
            })
            .state('transfers',{
                parent: 'inventory',
                url: "/transfers",
                templateUrl: 'app/inventory/transfer/transfers.html',
                controller: 'TransfersController',
                controllerAs: 'vm',
                data: {
                    pageTitle: 'masterdata.common.transfers',
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
                            'app/inventory/transfer/transfers.controller.js'
                        ]);
                    }]
                }
            })
            .state('transfers-create',{
                parent: 'transfers',
                url: "/create",
                templateUrl: 'app/inventory/transfer/table-sorter/transfer.create.html',
                controller: 'TransferCrudController',
                controllerAs: 'vm',
                data: {
                    pageTitle: 'transfer.common.Create',
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
                            'app/inventory/transfer/transfer.crud.controller.js'
                        ]);
                    }]
                }
            })
            .state('transfers-detail',{
                parent: 'transfers',
                url: "/{transferId:[0-9]{1,4}}/details",
                templateUrl: 'app/inventory/transfer/transfer.detail.html',
                controller: 'TransferCrudController',
                controllerAs: 'vm',
                data: {
                    pageTitle: 'transfer.common.Detail',
                    authorities: ['ROLE_ADMIN'], //TODO change role,
                    sideBarMenu: 'inventory'
                },
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'lazy_ionRangeSlider',
                            'lazy_tablesorter',
                            'lazy_iCheck',
                            'lazy_wizard',
                            'lazy_KendoUI',
                            'app/inventory/transfer/transfer.crud.controller.js'
                        ]);
                    }]
                }
            })
            .state('transfers-edit',{
                parent: 'transfers',
                url: "/{transferId:[0-9]{1,4}}/edit",
                templateUrl: 'app/inventory/transfer/table-sorter/transfer.edit.html',
                controller: 'TransferCrudController',
                controllerAs: 'vm',
                data: {
                    pageTitle: 'transfer.common.Edit',
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
                            'app/inventory/transfer/transfer.crud.controller.js'
                        ]);
                    }]
                }
            })
            .state('transfers-scrap-list',{
                parent: 'inventory',
                url: "/transfers/{transferId:[0-9]{1,4}}/details/scrap_list",
                templateUrl: 'app/inventory/transfer/transfer_scrap.list.html',
                controller: 'TransferScrapController',
                controllerAs: 'vm',
                data: {
                    pageTitle: 'transfer.common.Detail',
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
                            'lazy_wizard',
                            'lazy_KendoUI',
                            'app/inventory/transfer/transfer.scrap.controller.js'
                        ]);
                    }]
                }
            })
            .state('transfers-scrap-create',{
                parent: 'inventory',
                url: "/transfers/{transferId:[0-9]{1,4}}/details/scrap_create",
                templateUrl: 'app/inventory/transfer/transfer_scrap.create.html',
                controller: 'TransferScrapController',
                controllerAs: 'vm',
                data: {
                    pageTitle: 'transfer.common.Detail',
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
                            'lazy_wizard',
                            'lazy_KendoUI',
                            'app/inventory/transfer/transfer.scrap.controller.js'
                        ]);
                    }]
                }
            })
            .state('transfers-scrap-detail',{
                parent: 'inventory',
                url: "/transfers/{transferId:[0-9]{1,4}}/details/scrap_detail",
                templateUrl: 'app/inventory/transfer/transfer_scrap.detail.html',
                controller: 'TransferScrapController',
                controllerAs: 'vm',
                data: {
                    pageTitle: 'transfer.common.Detail',
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
                            'lazy_wizard',
                            'lazy_KendoUI',
                            'app/inventory/transfer/transfer.scrap.controller.js'
                        ]);
                    }]
                }
            })
            .state('packages',{
                parent: 'inventory',
                url: "/packages",
                templateUrl: 'app/inventory/packages/packages.html',
                controller: 'PackagesController',
                controllerAs: 'vm',
                data: {
                    pageTitle: 'masterdata.common.packages',
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
                            'app/inventory/packages/packages.home.controller.js'
                        ]);
                    }]
                }
            })
            .state('packages-create',{
                parent: 'packages',
                url: "/create",
                templateUrl: 'app/inventory/packages/packages.create.html',
                controller: 'PackagesCrudController',
                controllerAs: 'vm',
                data: {
                    pageTitle: 'masterdata.common.packages',
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
                            'app/inventory/packages/packages.crud.controller.js'
                        ]);
                    }]
                }
            })
            .state('packages-detail',{
                parent: 'packages',
                url: "/{packageId:[0-9]{1,4}}/details",
                templateUrl: 'app/inventory/packages/packages.detail.html',
                controller: 'PackagesCrudController',
                controllerAs: 'vm',
                data: {
                    pageTitle: 'masterdata.common.packages',
                    authorities: ['ROLE_ADMIN'], //TODO change role,
                    sideBarMenu: 'inventory'
                },
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'lazy_ionRangeSlider',
                            'lazy_tablesorter',
                            'lazy_iCheck',
                            'lazy_wizard',
                            'lazy_KendoUI',
                            'app/inventory/packages/packages.crud.controller.js'
                        ]);
                    }]
                }
            })
            .state('packages-edit',{
                parent: 'packages',
                url: "/{packageId:[0-9]{1,4}}/edit",
                templateUrl: 'app/inventory/packages/packages.edit.html',
                controller: 'PackagesCrudController',
                controllerAs: 'vm',
                data: {
                    pageTitle: 'masterdata.common.packages',
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
                            'app/inventory/packages/packages.crud.controller.js'
                        ]);
                    }]
                }
            })

            .state('product-move',{
                parent: 'inventory',
                url: "/product-move",
                templateUrl: 'app/inventory/productmove/product_move.html',
                controller: 'ProductMoveHomeController',
                controllerAs: 'vm',
                params: {
                    product_id: null,
                    inputPickingMove: null
                },
                data: {
                    pageTitle: 'masterdata.common.productmove',
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
                            'app/inventory/productmove/product_move.home.controller.js'
                        ]);
                    }]
                }
            })
            .state('product-move-detail',{
                parent: 'product-move',
                url: "/{id:[0-9]{1,4}}/details",
                templateUrl: 'app/inventory/productmove/product_move.detail.html',
                controller: 'ProductMoveController',
                controllerAs: 'vm',
                data: {
                    pageTitle: 'masterdata.common.productmove',
                    authorities: ['ROLE_ADMIN'], //TODO change role,
                    sideBarMenu: 'inventory'
                },
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'lazy_ionRangeSlider',
                            'lazy_tablesorter',
                            'lazy_iCheck',
                            'lazy_wizard',
                            'lazy_KendoUI',
                            'app/inventory/productmove/product_move.controller.js'
                        ]);
                    }]
                }
            })

            .state('stock-quantity',{
                parent: 'inventory',
                url: "/stock-quantity",
                templateUrl: 'app/inventory/stock-quantity/stock_quantity.html',
                controller: 'StockQuantityHomeController',
                controllerAs: 'vm',
                params: {
                    product_id: null,
                    location_id:null
                },
                data: {
                    pageTitle: 'masterdata.common.stockQuantity',
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
                            'app/inventory/stock-quantity/stock_quantity.home.controller.js'
                        ]);
                    }]
                }
            })
            .state('stock-quantity-detail',{
                parent: 'stock-quantity',
                url: "/{id:[0-9]{1,4}}/details",
                templateUrl: 'app/inventory/stock-quantity/stock_quantity.detail.html',
                controller: 'StockQuantityController',
                controllerAs: 'vm',
                data: {
                    pageTitle: 'masterdata.common.stockQuantity',
                    authorities: ['ROLE_ADMIN'], //TODO change role,
                    sideBarMenu: 'inventory'
                },
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'lazy_ionRangeSlider',
                            'lazy_tablesorter',
                            'lazy_iCheck',
                            'lazy_wizard',
                            'lazy_KendoUI',
                            'app/inventory/stock-quantity/stock_quantity.controller.js'
                        ]);
                    }]
                }
            })

            .state('lots',{
                parent: 'inventory',
                url: "/lots",
                templateUrl: 'app/inventory/lots/lots.html',
                controller: 'LotHomeController',
                controllerAs: 'vm',
                data: {
                    pageTitle: 'masterdata.common.lots',
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
                            'app/inventory/lots/lots.home.controller.js'
                        ]);
                    }]
                }
            })
            .state('lots-create',{
                parent: 'lots',
                url: "/create",
                templateUrl: 'app/inventory/lots/lots.create.html',
                controller: 'LotCrudController',
                controllerAs: 'vm',
                data: {
                    pageTitle: 'masterdata.common.lots',
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
                            'app/inventory/lots/lots.crud.controller.js'
                        ]);
                    }]
                }
            })
            // REPORTING
            .state('inventory-report',{
                parent: 'inventory',
                url: '/inventory-report',
                templateUrl: 'app/inventory/reporting/inventory-report/inventory-report.home.html',
                controller: 'InventoryReportController',
                controllerAs: 'vm',
                data: {
                    pageTitle: 'inventory.reporting.inventory-report.title',
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
                            'app/inventory/reporting/inventory-report/inventory-report.controller.js'
                        ]);
                    }]
                }
            })
            .state('inventory-report-detail',{
                parent: 'inventory',
                url: '/inventory-report/details',
                templateUrl: 'app/inventory/reporting/inventory-report/inventory-report.detail.html',
                controller: 'InventoryReportController',
                controllerAs: 'vm',
                params: {
                    inputData: null,
                    reportData: null,
                    originParam: null
                },
                data: {
                    pageTitle: 'inventory.reporting.inventory-report.detail.title',
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
                            'app/inventory/reporting/inventory-report/inventory-report.controller.js'
                        ]);
                    }]
                }
            })
    }
})();