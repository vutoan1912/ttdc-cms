angular
    .module('erpApp')
    .controller('main_sidebarCtrl', [
        '$timeout',
        '$scope',
        '$rootScope',
        '$translate', 'JhiLanguageService', 'tmhDynamicLocale','$window',
        function ($timeout,$scope,$rootScope,$translate, JhiLanguageService, tmhDynamicLocale,$window) {
            $scope.$on('onLastRepeat', function (scope, element, attrs) {
                $timeout(function() {
                    if(!$rootScope.miniSidebarActive) {
                        // activate current section
                        $('#sidebar_main').find('.current_section > a').trigger('click');
                    } else {
                        // add tooltips to mini sidebar
                        var tooltip_elem = $('#sidebar_main').find('.menu_tooltip');
                        tooltip_elem.each(function() {
                            var $this = $(this);
    
                            $this.attr('title',$this.find('.menu_title').text());
                            UIkit.tooltip($this, {
                                pos: 'right'
                            });
                        });
                    }
                })
            });
    
            // language switcher
            if($window.localStorage.getItem("lang") !=null){
                $scope.langSwitcherModel = $window.localStorage.getItem("lang")
            } else {
                $scope.langSwitcherModel = 'gb';
            }
            var langData = $scope.langSwitcherOptions = [
                {id: 1, title: 'English', value: 'gb'},
                {id: 2, title: 'Tiếng Việt', value: 'vn'}
            ];

            $scope.langSwitcherConfig = {
                maxItems: 1,
                render: {
                    option: function(langData, escape) {
                        return  '<div class="option">' +
                            '<i class="item-icon flag-' + escape(langData.value).toUpperCase() + '"></i>' +
                            '<span>' + escape(langData.title) + '</span>' +
                            '</div>';
                    },
                    item: function(langData, escape) {
                        return '<div class="item"><i class="item-icon flag-' + escape(langData.value).toUpperCase() + '"></i></div>';
                    }
                },
                valueField: 'value',
                labelField: 'title',
                searchField: 'title',
                create: false,
                onInitialize: function(selectize) {
                    $('#lang_switcher').next().children('.selectize-input').find('input').attr('readonly',true);
                },
                onChange: function(value) {
                    var langKey = value==='gb' ? 'en' : (value==='vn'? 'vi' : 'en');
                    $translate.use(langKey);
                    tmhDynamicLocale.set(langKey);
                    $window.localStorage.setItem("lang",value)
                }
            };
            $scope.$watch('langSwitcherModel', function() {
                var value = $scope.langSwitcherModel;
                var langKey = value==='gb' ? 'en' : (value==='vn'? 'vi' : 'en');
                $translate.use(langKey);
                tmhDynamicLocale.set(langKey);
            });
    
            // menu entries
            var menu = {
                'admin': [
                    {
                        id: 0,
                        title: 'admin.menu.setting',
                        icon: '&#xE8B8;',
                        submenu: [
                            {
                                title: 'admin.menu.generalSetting'
                            },
                            {
                                title: 'admin.menu.userPermision',
                                submenu: [
                                    {
                                        title: 'admin.menu.users',
                                        link: 'users'
                                    },
                                    {
                                        title: 'admin.menu.roles',
                                        link: 'roles'
                                    },
                                    {
                                        title: 'admin.menu.privileges',
                                        link: 'privileges'
                                    }
                                ]
                            }
                        ]
                    }
                ],
                'inventory': [
                    /*{
                        id: 0,
                        title: 'masterdata.common.Masterdata',
                        icon: '&#xE84F;',
                        submenu: [
                            {
                                title: 'masterdata.common.Products',
                                link: 'products'
                            },
                            {
                                title:'masterdata.common.Manufacture',
                                link:'manufacturers'
                            },
                            {
                                title:'masterdata.common.Suppliers',
                                link:'suppliers'
                            },
                            {
                                title:'masterdata.common.BoM',
                                link:'bom'
                            },
                            {
                                title:'masterdata.common.Routing'
                            },
                            {
                                title:'masterdata.common.Package',
                                link:'packages'
                            },
                            {
                                title:'masterdata.common.lots',
                                link:'lots'
                            }
                        ]
                    },*/
                    {
                        id: 0,
                        title: 'Customer care',
                        icon: '&#xE8D6;',
                        submenu: [
                            {
                                title: 'Lịch sử tương tác',
                                link: 'cskh'
                            },
                            {
                                title: 'Tra cứu trúng thưởng',
                                link: 'prize'
                            }
                            ,
                            {
                                title: 'Tra cứu đăng ký / hủy',
                                link: 'register'
                            },
                            {
                                title: 'Tra cứu MO/MT',
                                link: 'momt'
                            },
                            {
                                title: 'Tra cứu trừ cước',
                                link: 'charge'
                            },
                            {
                                title: 'Tra cứu thông tin thuê bao',
                                link: 'sub'
                            }

                        ]
                    },
                    {
                        id: 1,
                        title: 'Reporting',
                        icon: '&#xE85D;',
                        submenu: [
                            {
                                title: 'Doanh thu ngày',
                                link: 'revenue-day'
                            },
                            {
                                title: 'Doanh thu tuần',
                                link: 'revenue-week'
                            },
                            {
                                title: 'Doanh thu tháng',
                                link: 'revenue-month'
                            },
                            {
                                title: 'Doanh thu năm',
                                link: 'revenue-year'
                            },
                            {
                                title: 'Doanh thu quý',
                                link: 'revenue-quarter'
                            },
                            {
                                title: 'Doanh thu gia hạn',
                                link: 'revenue-renewal'
                            },
                            {
                                title: 'Doanh thu đăng ký',
                                link: 'revenue-register'
                            },
                            {
                                title: 'Sản lượng theo ngày',
                                link: 'output-day'
                            },
                            {
                                title: 'Sản lượng theo tháng',
                                link: 'output-month'
                            },
                            {
                                title: 'Sản lượng theo thuê bao',
                                link: 'output-sub'
                            }
                        ]
                    },
                    {
                        id: 2,
                        title: 'Reporting CP',
                        icon: '&#xE85D;',
                        submenu: [
                            {
                                title: 'Doanh thu ngày',
                                link: 'revenue-day-cp'
                            },
                            // {
                            //     title: 'Doanh thu tuần',
                            //     link: 'revenue-week-cp'
                            // },
                            // {
                            //     title: 'Doanh thu tháng',
                            //     link: 'revenue-month-cp'
                            // },
                            // {
                            //     title: 'Doanh thu năm',
                            //     link: 'revenue-year-cp'
                            // },
                            // {
                            //     title: 'Doanh thu quý',
                            //     link: 'revenue-quarter-cp'
                            // },
                            // {
                            //     title: 'Doanh thu gia hạn',
                            //     link: 'revenue-renewal-cp'
                            // },
                            // {
                            //     title: 'Doanh thu đăng ký',
                            //     link: 'revenue-register-cp'
                            // },
                            {
                                title: 'Sản lượng theo ngày',
                                link: 'output-day-cp'
                            }
                            // {
                            //     title: 'Sản lượng theo tháng',
                            //     link: 'output-month-cp'
                            // },
                            // {
                            //     title: 'Sản lượng theo thuê bao',
                            //     link: 'output-sub-cp'
                            // }
                        ]
                    },
                    {
                        id: 3,
                        title: 'masterdata.common.configuration',
                        icon: '&#xE8B8;',
                        submenu: [
                            {
                                title: 'Cấu hình tin nhắn dịch vụ',
                                link: 'momt-config'
                            }
                        ]
                        /*submenu: [
                            {
                                title: 'masterdata.common.wm',
                                submenu:[
                                    {
                                        title:'masterdata.common.warehouse',
                                        link:'warehouses'
                                    },
                                    {
                                        title:'masterdata.common.locations',
                                        link:'locations'
                                    },
                                    {
                                        title:'masterdata.common.routes',
                                        link:'routes'
                                    },
                                    {
                                        title:'masterdata.common.ots',
                                        link:'operation-types'
                                    }
                                ]
                            },
                            {
                                title:'masterdata.common.reference',
                                link:'sequences'
                            },
                            {
                                title: 'admin.menu.uoms',
                                link: 'uoms'
                            }

                        ]*/
                    }
                ]
            };

            $scope.sections = menu[$rootScope.toState.data.sideBarMenu];
            $rootScope.$on('$stateChangeSuccess', function () {
                $scope.sections = menu[$rootScope.toState.data.sideBarMenu];
            });
        }
    ])
;