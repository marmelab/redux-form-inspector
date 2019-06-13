"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _reactRedux = require("react-redux");

var _reduxForm = require("redux-form");

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

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

    var errors = _objectSpread({}, (0, _reduxForm.getFormAsyncErrors)(form)(state), (0, _reduxForm.getFormSyncErrors)(form)(state));

    var inspection = Object.keys(fieldsToProps).reduce(function (r, prop) {
      return _objectSpread({}, r, _defineProperty({}, prop, fieldValues ? fieldsToProps[prop](fieldValues, errors) : null));
    }, {});
    return !inspectorKey ? inspection : _defineProperty({}, inspectorKey, inspection);
  }, function () {
    return {};
  });
};

exports["default"] = _default;