/**
 * @author alex <jie.zhang@yunbaoxiao.com>
 * @licence MIT
 */
define(['angular'], function(angular) {
    debugger
    angular.module('ng-dropdown', []).constant('ngDropdownVersion', '1.0.0') // const var 
    .constant('ngDropdownDefaultOptions', {
        onChange: function(oldValue, newValue, item) {},
        onSelect: function(oldValue, newValue, item) {}
    }) // const var 
    .directive('ngDropdown', ['$parse', 'ngDropdownDefaultOptions',
        function($parse, ngDropdownDefaultOptions) {
            // Export
            debugger
            var getItemByKey = function(key, ls) {
                for (var i = 0; i < ls.length; i++) {
                    var item = ls[i];
                    if (key == item['value']) {
                        return item
                    }
                }
                return {
                    text: '',
                    value: ''
                };
            };
            return {
                restrict: 'EA',
                scope: {
                    ngDropdown: "=?",
                    'paramObject': '=?',
                    'data': '=?'
                },
                replace: true,
                transclude: true,
                template: '<div ng-transclude></div>',
                link: function($scope, element, attrs) {
                    var item = getItemByKey($scope.paramObject['type'], $scope.data);
                    // init
                    if (item['text']) {
                        $(element).find('.text').removeClass('font-placeholder');
                        //fix me
                        setTimeout(function() {
                            $(element).find('.option-list .item').eq(parseInt(item['value'] - 1)).addClass('active');
                        }, 1000);
                    }
                    item['text'] && $(element).find('.text').text(item['text']);
                    var oldValue = item['value'];
                    var options = angular.extend(ngDropdownDefaultOptions, $scope.ngDropdown);
                    $(element).on('click', '.item', function(e) {
                        $(element).find('.text').removeClass('font-placeholder');
                        var $item = $(e.toElement);
                        var text = $item.text();
                        var newValue = $item.data('value');
                        $(element).find('.text').text(text);
                        $(element).find('.option-list').addClass('none');
                        $(element).find('.text').removeClass('focus');
                        if (oldValue != newValue) {
                            options['onChange'](oldValue, newValue, $item[0], $scope.paramObject);
                        }
                        options['onSelect'](oldValue, newValue, $item[0]);
                        $item.addClass('active').siblings().removeClass('active');
                        oldValue = newValue;
                        e.stopPropagation();
                    });
                    $(document.body).on('click', function(e) {
                        setTimeout(function() {
                            $(element).find('.option-list').addClass('none');
                            $(element).find('.text').removeClass('focus');
                        }, 60);
                    });
                    $(element).on('click', '.text', function(e) {
                        $(element).find('.option-list').removeClass('none');
                        $(e.currentTarget).addClass('focus');
                        e.stopPropagation()
                    });
                }
            };
        }
    ]);
});