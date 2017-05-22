'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _reactRedux = require('react-redux');

var _reduxForm = require('redux-form');

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

exports.default = function (rules, formName) {
    var inspectorKey = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'inspection';

    var FormInspectorComponent = function FormInspectorComponent(BaseComponent) {
        return (0, _reactRedux.connect)(function (state) {
            var fieldValues = (0, _reduxForm.getFormValues)(formName)(state);

            var inspection = Object.keys(rules).reduce(function (r, rule) {
                return _extends({}, r, _defineProperty({}, rule, fieldValues ? rules[rule](fieldValues) : {}));
            }, {});

            return _defineProperty({}, inspectorKey, inspection);
        }, function () {
            return {};
        })(BaseComponent);
    };

    return FormInspectorComponent;
};