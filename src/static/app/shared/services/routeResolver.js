'use strict';

define([], function () {

    var viewsDirectory = '/static/app';
    var controllersDirectory = '/static/app';

    function resolveDependencies($q, $rootScope, dependencies) {
        var defer = $q.defer();
        require(dependencies, function () {
            defer.resolve();
            $rootScope.$apply()
        });
        return defer.promise;
    };
    /**
     * [RouteResolver description] this is a constructor
     */
    function RouteResolver () {
        this.$get = function () {
            return this;
        };
       
        this.route = {
            resolve: function (modName, secure) {

                var routeDef = {};

                // this make the route to load template.html
                var parentPath = modName

                var staticModPath = [
                    controllersDirectory,
                    parentPath,
                    modName + 'Controller.js'
                ].join('/');

                var staticTemplatePath = [
                    viewsDirectory,
                    parentPath,
                    'index.html'
                ].join('/');

                routeDef.templateUrl = staticTemplatePath;
                // this get the controller in angular.module('app').controller()
                routeDef.controller = modName + "Controller";
                routeDef.secure = (secure) ? secure : false;
                routeDef.resolve = {
                    load: ['$q', '$rootScope', function ($q, $rootScope) {
                        var dependencies = [staticModPath];
                        return resolveDependencies($q, $rootScope, dependencies);
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