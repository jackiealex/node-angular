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
       
        this.route = {
            resolve: function (modName, secure) {

                var routeDef = {};

                // this make the route to load template.html
                var parentPath = modName.toLowerCase();

                var staticModPath = [
                    controllersDirectory,
                    parentPath,
                    modName + 'Controller.js'
                ].join('/');

                var staticTemplatePath = [
                    viewsDirectory,
                    parentPath,
                    'index.html' //we define index.html as entry file which can inucude children files
                ].join('/');

                // this tell angular where to load the template
                routeDef.templateUrl = staticTemplatePath;
                // this get the controller in angular.module('app').controller('modName'), it tell anguarl where to use it
                routeDef.controller = modName + "Controller";
                routeDef.secure = (secure) ? secure : false;
                routeDef.resolve = {
                    done: ['$q', '$rootScope', function ($q, $rootScope) {
                        var dependencies = [staticModPath];

                        var defer = $q.defer();

                        require(dependencies, function () {
                            defer.resolve();
                            // $rootScope.$apply();
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