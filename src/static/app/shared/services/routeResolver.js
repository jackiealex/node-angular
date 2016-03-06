'use strict';

define([], function () {

    var viewsDirectory = '/static/app';
    var controllersDirectory = '/static/app';

    /**
     * [RouteResolver description] this is a constructor
     */
    function RouteResolver () {
        this.$get = function () {
            return this;
        };

        /**
         * [resolve description]
         * @param  {[type]} modName templates/List or Template
         * if modName equals templates/List, the template path will be template/list.html and the controller path will be templates/ListController
         * if modName equals Hello, the template path will be template/hello.html and the controller path will be templates/HelloController
         * @return {[type]}         [path object]
         */
        function getTemplateAndControllerPath(modName) {

            var slashLastIndex = modName.lastIndexOf('/');
            var parentPath = modName.toLowerCase();
            var prefixController = '';
            if(slashLastIndex!=-1) {
                parentPath = modName.substr(0, slashLastIndex).toLowerCase();
                modName = modName.substr(slashLastIndex + 1);
                modName = modName[0].toUpperCase() + modName.toString().slice(1);
                prefixController = parentPath[0].toUpperCase() + parentPath.toString().slice(1);
            }

            var staticControllerPath = [
                controllersDirectory,
                parentPath,
                modName + 'Controller.js'
            ].join('/');

            var staticTemplatePath = [
                viewsDirectory,
                parentPath,
                slashLastIndex !=-1? modName.toLowerCase() + '.html': 'index.html' //we define index.html as entry file which can inucude children files
            ].join('/');

            return {
                templateUrl: staticTemplatePath,
                controllerUrl: staticControllerPath,
                controllerName: prefixController + modName + 'Controller'
            }
        }
       
        this.route = {
            
            resolve: function (modName, opts) {
                opts || (opts={});
                var routeDef = {};

                var resource = getTemplateAndControllerPath(modName);
                routeDef.controller = resource['controllerName'];
                routeDef.templateUrl = resource['templateUrl'];

                routeDef.resolve = {
                    done: ['$q', '$rootScope', '$ocLazyLoad', function ($q, $rootScope, $ocLazyLoad) {
                        var dependencies = [resource['controllerUrl']];

                        var defer = $q.defer();

                        require(dependencies, function () {
                            
                                defer.resolve();
                            
                        }, function error(err) {
                            console.error('error');
                        });
                        
                        return defer.promise;
                    }]
                };
                return routeDef;
            }
        };
    };

    var servicesApp = angular.module('routeResolverServices', []);

    //Must be a provider since it will be injected into module.config()    
    servicesApp.provider('routeResolver', RouteResolver);
});