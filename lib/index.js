"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _reactRedux = require("react-redux");

var _reduxForm = require("redux-form");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _default = function _default(_ref) {
  var form = _ref.form,
      _ref$fieldsToProps = _ref.fieldsToProps,
      fieldsToProps = _ref$fieldsToProps === void 0 ? {} : _ref$fieldsToProps,
      inspectorKey = _ref.inspectorKey;

  if (!form) {
    throw new Error('You must provide a form identifier in the "form" configuration key.');
  }

  return (0, _reactRedux.connect)(function (state) {
    var fieldValues = (0, _reduxForm.getFormValues)(form)(state);

    var errors = _objectSpread(_objectSpread({}, (0, _reduxForm.getFormAsyncErrors)(form)(state)), (0, _reduxForm.getFormSyncErrors)(form)(state));

    var inspection = Object.keys(fieldsToProps).reduce(function (r, prop) {
      return _objectSpread(_objectSpread({}, r), {}, _defineProperty({}, prop, fieldValues ? fieldsToProps[prop](fieldValues, errors) : null));
    }, {});
    return !inspectorKey ? inspection : _defineProperty({}, inspectorKey, inspection);
  }, function () {
    return {};
  });
};

exports["default"] = _default;