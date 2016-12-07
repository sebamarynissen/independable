// Wrap in a global clusure, we need some more.
!function() {

var _ = {};
_.isArray = Array.isArray || function(obj) {
    Object.prototype.toString.call(obj) === '[object Array]';
};
_.isFunction = function(obj) {
    return typeof obj === 'function';
};
_.isObject = function(obj) {
    var type = typeof obj;
    return type === 'function' || type === 'object' && !!obj;
};
_.each = function(obj, fn) {
    if (_.isArray(obj)) {
        for (var i = 0; i < obj.length; i++) {
            fn.call(obj, obj[i], i);
        }
    }
    else {
        for (var i in obj) {
            fn.call(obj, obj[i], i);
        }
    }
};

(function(factory, global) {
    if (typeof define == "function" && define.amd) {
        // AMD
        define([], function() {
            return factory;
        });
    }
    else if ( typeof module === "object" && typeof module.exports === "object" ) {
        // CommonJS
        module.exports = factory;
    }
    else {
        // Global
        var old = global.independable;
        global.independable = factory;
        factory.noConflict = function() {
            global.independable = old;
            return factory;
        };
    }
})(function() {

    // The object containing all the services.
    var services = {};

    // Some private functions
    var defineOne = function(name, def) {
        if (typeof def === 'function') {
            def = (function(def) {
                return {
                    'deps': [],
                    get: function() {
                        return def.apply(this, arguments);
                    }
                };
            })(def);
        }
        if (!_.isArray(def.deps)) {
            def.deps = [];
        }
        services[name] = {
            'name': name,
            'def': def
        };
    };

    // Helper function which wraps simple service registrations as a definition
    var wrap = function(obj) {
        return function() {
            return obj;
        };
    };

    // The created container object.
    return {

        // Registers anything as a service.
        register: function(name, thing) {
            if (typeof name === 'string') {
                defineOne(name, function() {
                    return thing;
                });      
            }
            else {
                _.each(name, function(thing, name) {
                    defineOne(name, function() {
                        return thing;
                    });
                });
            }
            return this;
        },

        // Defines services. If the name parameter is an object hash, we'll 
        // treat it as an object containing services. Otherwise, we'll register
        // normally.
        define: function(name, def) {
            var container = this;
            if (typeof name === 'string') {
                if (!_.isFunction(def) && !_.isObject(def) && !_.isFunction(def.get)) {
                    throw new Error('Trying to define ' + def + ', which is invalid! A definition should be a function or an object hash containing a get function!');
                }
                defineOne(name, def);
            }
            else {
                _.each(name, function(def, name) {
                    container.define(name, def);
                });
            }
            return this;
        },

        // Gets a service, but throws an error when it was not defined yet.
        get: function(name) {
            var container = this;
            if (!services.hasOwnProperty(name)) {
                throw new Error('Service ' + name + ' was not found!');
            }
            if (!services[name].hasOwnProperty('ref')) {
                var def = services[name].def,
                    deps = [];
                _.each(def.deps, function(dep) {
                    deps.push(container.get(dep));
                });
                services[name].ref = def.get.apply(container, deps);
            }
            return services[name].ref;
        }

    };

}, this);

}();