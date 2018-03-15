(function(){
    'use strict';
    angular.module('erpApp')
        .config(stateConfig);
    stateConfig.$inject = ['$stateProvider']

    function stateConfig($stateProvider) {

        $stateProvider
            .state('masterdata',{
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
                parent: 'masterdata',
                url: '/',
                templateUrl: 'app/masterdata/product/product.html',
                controller: 'ProductHomeController',
                controllerAs: 'vm',
                data: {
                    pageTitle: 'masterdata.common.Products',
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
                            'app/masterdata/product/product.home.controller.js'
                        ]);
                    }]
                }
            })
            .state('products',{
                parent: 'masterdata',
                url: '/products',
                templateUrl: 'app/masterdata/product/product.html',
                controller: 'ProductHomeController',
                controllerAs: 'vm',
                data: {
                    pageTitle: 'masterdata.common.Products',
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
                            'app/masterdata/product/product.home.controller.js'
                        ]);
                    }]
                }
            })
            .state('products-detail',{
                parent: 'products',
                url: "/{productId:[0-9]{1,4}}/details",
                templateUrl: 'app/masterdata/product/product.detail.html',
                controller: 'ProductController',
                controllerAs: 'vm',
                data: {
                    pageTitle: 'masterdata.common.ProductDetail',
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
                            'app/masterdata/product/product.controller.js'
                        ]);
                    }]
                }
            })
            .state('products-edit',{
                parent: 'masterdata',
                url: "/{productId:[0-9]{1,4}}/edit",
                templateUrl: 'app/masterdata/product/product.edit.html',
                controller: 'ProductController',
                controllerAs: 'vm',
                data: {
                    pageTitle: 'masterdata.common.ProductEdit',
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
                            'app/masterdata/product/product.controller.js'
                        ]);
                    }]
                }
            })
            .state('manufacturers',{
                parent: 'masterdata',
                url: '/manufacturers',
                templateUrl: 'app/masterdata/manufacturer/list_manufacturer.html',
                controller: 'ManufacturerController',
                controllerAs: 'vm',
                data: {
                    pageTitle: 'Manufacturer Manager',
                    displayName: 'Manufacturer Manager',
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
                            'app/masterdata/manufacturer/manufacturer.controller.js'
                        ]);
                    }]
                }
            })
            .state('manufacturers.detail',{
                parent: 'manufacturers',
                url: "/details?id",
                templateUrl: 'app/masterdata/manufacturer/manufacturer.detail.html',
                controller: 'ManufacturerDetailController',
                controllerAs: 'vm',
                data: {
                    pageTitle: 'Manufacturer Detail',
                    displayName: 'Manufacturer Detail',
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
                            'app/masterdata/manufacturer/manufacturer_detail.controller.js',
                            'app/masterdata/manufacturer/sub_manufacturer_detail.controller.js',
                        ]);
                    }]
                }
            })
            .state('manufacturers.sub_detail',{
                parent: 'masterdata',
                url: "/manufacturers/details?id",
                templateUrl: 'app/masterdata/manufacturer/subDetailManufacturer.html',
                controller: 'SubManufacturerDetailController',
                controllerAs: 'vm',
                data: {
                    pageTitle: 'Manufacturer Detail',
                    displayName: 'Manufacturer Detail',
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
                            'app/masterdata/manufacturer/sub_manufacturer_detail.controller.js',
                        ]);
                    }]
                }
            })
            .state('suppliers',{
                parent: 'masterdata',
                url: '/suppliers',
                templateUrl: 'app/masterdata/supplier/list_supplier.html',
                controller: 'SupplierController',
                controllerAs: 'vm',
                data: {
                    pageTitle: 'Supplier Manager',
                    displayName: 'Supplier Manager',
                    authorities: ['ROLE_ADMIN'], //TODO change role,
                    sideBarMenu: 'inventory'
                },
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'lazy_ionRangeSlider',
                            'lazy_tablesorter',
                            'lazy_iCheck',
                            'app/masterdata/supplier/supplier.controller.js'
                        ]);
                    }]
                }
            })
            .state('suppliers.detail',{
                parent: 'suppliers',
                url: "/details?id",
                templateUrl: 'app/masterdata/supplier/supplier.detail.html',
                controller: 'SupplierDetailController',
                controllerAs: 'vm',
                data: {
                    pageTitle: 'Supplier Detail',
                    displayName: 'Supplier Detail',
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
                            'app/masterdata/supplier/supplier_detail.controller.js'
                        ]);
                    }]
                }
            })
            .state('suppliers.sub_detail',{
                parent: 'masterdata',
                url: "/suppliers/details?id",
                templateUrl: 'app/masterdata/supplier/subDetailSupplier.html',
                controller: 'SubSupplierDetailController',
                controllerAs: 'vm',
                data: {
                    pageTitle: 'Supplier Detail',
                    displayName: 'Supplier Detail',
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
                            'app/masterdata/supplier/sub_supplier_detail.controller.js'
                        ]);
                    }]
                }
            })
            .state('uoms',{
                parent: 'masterdata',
                url: '/uoms',
                templateUrl: 'app/masterdata/uom/uom.html',
                controller: 'UomController',
                controllerAs: 'vm',
                data: {
                    pageTitle: 'masterdata.common.uom',
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
                            'lazy_KendoUI',
                            'lazy_parsleyjs',
                            'app/masterdata/uom/uom.controller.js'
                        ]);
                    }]
                }
            })
            .state('uoms-create',{
                parent: 'uoms',
                url: '/uoms-create/{type}',
                templateUrl: 'app/masterdata/uom/uom.create.html',
                controller: 'UomController',
                controllerAs: 'vm',
                data: {
                    pageTitle: 'masterdata.common.createUom',
                    authorities:['ROLE_ADMIN'],
                    sideBarMenu: 'inventory'
                },
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'lazy_parsleyjs',
                            'app/masterdata/uom/uom.controller.js'
                        ]);
                    }]
                }
            })
            .state('uoms-detail',{
                parent: 'uoms',
                url:'/{uomId:[0-9]{1,4}}/detail',
                templateUrl:'app/masterdata/uom/uom.detail.html',
               // parent:'uoms',
                data: {
                    pageTitle: 'masterdata.common.UomDetail',
                    authorities:['ROLE_ADMIN'],
                    sideBarMenu: 'inventory'
                },
                controller: 'UomDetailController',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'lazy_parsleyjs',
                            'app/masterdata/uom/uom.detail.controller.js'
                        ]);
                    }]
                }

            })
            .state('uoms-edit',{
                url:'/{uomId:[0-9]{1,4}}/edit',
                templateUrl:'app/masterdata/uom/uom.edit.html',
                parent:'uoms',
                data: {
                    pageTitle: 'masterdata.common.EditUom',
                    authorities:['ROLE_ADMIN'],
                    sideBarMenu: 'inventory'
                },
                controller: 'UomEditController',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'lazy_parsleyjs',
                            'app/masterdata/uom/uom.edit.controller.js'
                        ]);
                    }]
                }

            })
            .state('bom',{
                parent: 'masterdata',
                url: '/bom',
                templateUrl: 'app/masterdata/bom/bom.html',
                controller: 'BomController',
                controllerAs: 'vm',
                params: {
                    product_id: null
                },
                data: {
                    pageTitle: 'BOM Manager',
                    displayName: 'BOM Manager',
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
                            'app/masterdata/bom/bom.controller.js'
                        ]);
                    }]
                }
            })
            .state('bom-rd-detail',{
                parent: 'bom',
                url: "/rd/detail/{id:[0-9]{1,4}}",
                templateUrl: 'app/masterdata/bom/bom.rd.detail.html',
                controller: 'BomRdDetailController',
                controllerAs: 'vm',
                data: {
                    pageTitle: 'BOM Manager',
                    displayName: 'BOM Manager',
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
                            'app/masterdata/bom/bom.detail.controller.js'
                        ]);
                    }]
                }
            })
            .state('bom-man-detail',{
                parent: 'bom',
                url: "/man/detail/{id:[0-9]{1,4}}",
                templateUrl: 'app/masterdata/bom/bom.man.detail.html',
                controller: 'BomManDetailController',
                controllerAs: 'vm',
                data: {
                    pageTitle: 'BOM Manager',
                    displayName: 'BOM Manager',
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
                            'app/masterdata/bom/bom.detail.controller.js'
                        ]);
                    }]
                }
            })
    }
})();