(function(){
    angular.module('angularytics', []).provider('Angularytics', function() {

        var eventHandlersNames = ['Google'];
        this.setEventHandlers = function(handlers) {
            if (angular.isString(handlers)) {
                handlers = [handlers];
            }
            eventHandlersNames = [];
            angular.forEach(handlers, function(handler) {
                eventHandlersNames.push(capitalizeHandler(handler))
            });
        }

        var capitalizeHandler = function(handler) {
            return handler.charAt(0).toUpperCase() + handler.substring(1).toLowerCase();
        }

        this.$get = function($injector, $rootScope, $location) {

            // Helper methods
            var eventHandlers = [];

            angular.forEach(eventHandlersNames, function(handler) {
                eventHandlers.push($injector.get('Angularytics' + handler + 'Handler'));
            });

            var forEachHandlerDo = function(action) {
                angular.forEach(eventHandlers, function(handler) {
                    action(handler);
                });
            }

            // Event listeing
            $rootScope.$on('$locationChangeSuccess', function() {
                forEachHandlerDo(function(handler) {
                    var url = $location.path();
                    if (url) {
                        handler.trackPageView(url);    
                    }
                })
            });

            var service = {};
            // Just dummy function so that it's instantiated on app creation
            service.init = function() {

            }

            service.trackEvent = function(category, action, opt_label, opt_value, opt_noninteraction) {
                forEachHandlerDo(function(handler) {
                    if (category && action) {
                        handler.trackEvent(category, action, opt_label, opt_value, opt_noninteraction);
                    }
                });
            }

            return service;

            

        };

    });
})();
