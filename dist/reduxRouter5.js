(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (factory((global.reduxRouter5 = {})));
}(this, (function (exports) { 'use strict';

    var NAVIGATE_TO = '@@router5/NAVIGATE';
    var CANCEL_TRANSITION = '@@router5/CANCEL';
    var TRANSITION_ERROR = '@@router5/TRANSITION_ERROR';
    var TRANSITION_SUCCESS = '@@router5/TRANSITION_SUCCESS';
    var TRANSITION_START = '@@router5/TRANSITION_START';
    var CLEAR_ERRORS = '@@router5/CLEAR_ERRORS';
    var CAN_DEACTIVATE = '@@router5/CAN_DEACTIVATE';
    var CAN_ACTIVATE = '@@router5/CAN_ACTIVATE';

    var actionTypes = /*#__PURE__*/Object.freeze({
        NAVIGATE_TO: NAVIGATE_TO,
        CANCEL_TRANSITION: CANCEL_TRANSITION,
        TRANSITION_ERROR: TRANSITION_ERROR,
        TRANSITION_SUCCESS: TRANSITION_SUCCESS,
        TRANSITION_START: TRANSITION_START,
        CLEAR_ERRORS: CLEAR_ERRORS,
        CAN_DEACTIVATE: CAN_DEACTIVATE,
        CAN_ACTIVATE: CAN_ACTIVATE
    });

    function navigateTo(name) {
        var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        var opts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

        return {
            type: NAVIGATE_TO,
            payload: {
                name: name,
                params: params,
                opts: opts
            }
        };
    }

    function cancelTransition() {
        return {
            type: CANCEL_TRANSITION
        };
    }

    function clearErrors() {
        return {
            type: CLEAR_ERRORS
        };
    }

    function transitionStart(route, previousRoute) {
        return {
            type: TRANSITION_START,
            payload: {
                route: route,
                previousRoute: previousRoute
            }
        };
    }

    function transitionSuccess(route, previousRoute) {
        return {
            type: TRANSITION_SUCCESS,
            payload: {
                route: route,
                previousRoute: previousRoute
            }
        };
    }

    function transitionError(route, previousRoute, transitionError) {
        return {
            type: TRANSITION_ERROR,
            payload: {
                route: route,
                previousRoute: previousRoute,
                transitionError: transitionError
            }
        };
    }

    function canActivate(name, canActivate) {
        return {
            type: CAN_ACTIVATE,
            payload: {
                name: name,
                canActivate: canActivate
            }
        };
    }

    function canDeactivate(name, canDeactivate) {
        return {
            type: CAN_DEACTIVATE,
            payload: {
                name: name,
                canDeactivate: canDeactivate
            }
        };
    }

    var actions = /*#__PURE__*/Object.freeze({
        navigateTo: navigateTo,
        cancelTransition: cancelTransition,
        clearErrors: clearErrors,
        transitionStart: transitionStart,
        transitionSuccess: transitionSuccess,
        transitionError: transitionError,
        canActivate: canActivate,
        canDeactivate: canDeactivate
    });

    function reduxPluginFactory(dispatch) {
        function reduxPlugin() {
            return {
                onTransitionStart: function onTransitionStart(toState, fromState) {
                    dispatch(transitionStart(toState, fromState));
                },
                onTransitionSuccess: function onTransitionSuccess(toState, fromState) {
                    dispatch(transitionSuccess(toState, fromState));
                },
                onTransitionError: function onTransitionError(toState, fromState, err) {
                    dispatch(transitionError(toState, fromState, err));
                }
            };
        }

        reduxPlugin.pluginName = 'REDUX_PLUGIN';

        return reduxPlugin;
    }

    var router5ReduxMiddleware = function router5ReduxMiddleware(router) {
        return function (store) {
            var dispatch = store.dispatch;

            router.setDependency('store', store);
            router.usePlugin(reduxPluginFactory(dispatch));

            return function (next) {
                return function (action) {
                    switch (action.type) {
                        case NAVIGATE_TO:
                            router.navigate(action.payload.name, action.payload.params, action.payload.opts);
                            break;

                        case CANCEL_TRANSITION:
                            router.cancel();
                            break;

                        case CAN_DEACTIVATE:
                            router.canDeactivate(action.payload.name, action.payload.canDeactivate);
                            break;

                        case CAN_ACTIVATE:
                            router.canActivate(action.payload.name, action.payload.canDeactivate);
                            break;

                        default:
                            return next(action);
                    }
                };
            };
        };
    };

    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
      return typeof obj;
    } : function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };

    var _extends = Object.assign || function (target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];

        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }

      return target;
    };

    var initialState = {
        route: null,
        previousRoute: null,
        transitionRoute: null,
        transitionError: null
    };

    function router5Reducer() {
        var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
        var action = arguments[1];

        switch (action.type) {
            case TRANSITION_START:
                return _extends({}, state, {
                    transitionRoute: action.payload.route,
                    transitionError: null
                });

            case TRANSITION_SUCCESS:
                return _extends({}, state, {
                    transitionRoute: null,
                    transitionError: null,
                    previousRoute: action.payload.previousRoute,
                    route: action.payload.route
                });

            case TRANSITION_ERROR:
                return _extends({}, state, {
                    transitionRoute: action.payload.route,
                    transitionError: action.payload.transitionError
                });

            case CLEAR_ERRORS:
                return _extends({}, state, {
                    transitionRoute: null,
                    transitionError: null
                });

            default:
                return state;
        }
    }

    var _typeof$1 = typeof Symbol === "function" && _typeof(Symbol.iterator) === "symbol" ? function (obj) {
        return typeof obj === "undefined" ? "undefined" : _typeof(obj);
    } : function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof(obj);
    };

    function nameToIDs(name) {
        return name.split('.').reduce(function (ids, name) {
            return ids.concat(ids.length ? ids[ids.length - 1] + '.' + name : name);
        }, []);
    }

    function exists(val) {
        return val !== undefined && val !== null;
    }

    function hasMetaParams(state) {
        return state && state.meta && state.meta.params;
    }

    function extractSegmentParams(name, state) {
        if (!hasMetaParams(state) || !exists(state.meta.params[name])) return {};

        return Object.keys(state.meta.params[name]).reduce(function (params, p) {
            params[p] = state.params[p];
            return params;
        }, {});
    }

    function transitionPath(toState, fromState) {
        var fromStateIds = fromState ? nameToIDs(fromState.name) : [];
        var toStateIds = nameToIDs(toState.name);
        var maxI = Math.min(fromStateIds.length, toStateIds.length);

        function pointOfDifference() {
            var i = void 0;

            var _loop = function _loop() {
                var left = fromStateIds[i];
                var right = toStateIds[i];

                if (left !== right) return {
                    v: i
                };

                var leftParams = extractSegmentParams(left, toState);
                var rightParams = extractSegmentParams(right, fromState);

                if (leftParams.length !== rightParams.length) return {
                    v: i
                };
                if (leftParams.length === 0) return 'continue';

                var different = Object.keys(leftParams).some(function (p) {
                    return rightParams[p] !== leftParams[p];
                });
                if (different) {
                    return {
                        v: i
                    };
                }
            };

            for (i = 0; i < maxI; i += 1) {
                var _ret = _loop();

                switch (_ret) {
                    case 'continue':
                        continue;

                    default:
                        if ((typeof _ret === 'undefined' ? 'undefined' : _typeof$1(_ret)) === "object") return _ret.v;
                }
            }

            return i;
        }

        var i = void 0;
        if (!fromState) {
            i = 0;
        } else if (!hasMetaParams(fromState) && !hasMetaParams(toState)) {
            i = 0;
        } else {
            i = pointOfDifference();
        }

        var toDeactivate = fromStateIds.slice(i).reverse();
        var toActivate = toStateIds.slice(i);

        var intersection = fromState && i > 0 ? fromStateIds[i - 1] : '';

        return {
            intersection: intersection,
            toDeactivate: toDeactivate,
            toActivate: toActivate
        };
    }

    function _toConsumableArray(arr) {
        if (Array.isArray(arr)) {
            for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
                arr2[i] = arr[i];
            }return arr2;
        } else {
            return Array.from(arr);
        }
    }

    function shouldUpdateNode(nodeName) {
        return function (toState, fromSate) {
            var _transitionPath = transitionPath(toState, fromSate),
                intersection = _transitionPath.intersection,
                toActivate = _transitionPath.toActivate,
                toDeactivateReversed = _transitionPath.toDeactivate;

            var toDeactivate = [].concat(_toConsumableArray(toDeactivateReversed)).reverse();

            if (toState.meta.options && toState.meta.options.reload) {
                return true;
            }

            if (nodeName === intersection) {
                return true;
            }

            if (toActivate.indexOf(nodeName) === -1) {
                return false;
            }

            var matching = true;

            for (var i = 0; i < toActivate.length; i += 1) {
                var activatedSegment = toActivate[i];
                var sameLevelDeactivatedSegment = toDeactivate[i];

                matching = activatedSegment === sameLevelDeactivatedSegment;

                if (matching && activatedSegment === nodeName) {
                    return true;
                }

                if (!matching) {
                    return false;
                }
            }

            // Should never be reached
            return false;
        };
    }

    function createRouteNodeSelector(routeNode) {
        var reducerKey = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'router';

        var routerStateSelector = function routerStateSelector(state) {
            return state[reducerKey] || state.get && state.get(reducerKey);
        };
        var lastReturnedValue = void 0;

        return function (state) {
            var _routerStateSelector = routerStateSelector(state),
                route = _routerStateSelector.route,
                previousRoute = _routerStateSelector.previousRoute;

            var shouldUpdate = !route ? true : shouldUpdateNode(routeNode)(route, previousRoute);

            if (!lastReturnedValue) {
                lastReturnedValue = { route: route, previousRoute: previousRoute };
            } else if (!previousRoute || previousRoute !== route && shouldUpdate) {
                lastReturnedValue = { route: route, previousRoute: previousRoute };
            }

            return lastReturnedValue;
        };
    }

    exports.router5Middleware = router5ReduxMiddleware;
    exports.router5Reducer = router5Reducer;
    exports.actions = actions;
    exports.actionTypes = actionTypes;
    exports.createRouteNodeSelector = createRouteNodeSelector;
    exports.reduxPlugin = reduxPluginFactory;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
