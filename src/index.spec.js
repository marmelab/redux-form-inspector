import React from 'react';

import { shallow } from 'enzyme';
import expect from 'expect';

import { reduxForm } from 'redux-form';
import { createStore } from 'redux';

import formInspector from './index';

const createFakeContextWithForm = (form = {}) => ({
    context: {
        store: createStore(v => v, { form }),
    },
});

describe('formInspector', () => {
    it('should throw an error if no form name is provided in the configuration object', () => {
        expect(() => {
            formInspector({});
        }).toThrow('You must provide a form identifier in the "form" configuration key.');
    });

    it('should map null to rule callback if form does not exist', () => {
        const InspectedComponent = formInspector({
            form: 'myForm',
            fieldsToProps: { myProp: () => 'Hello' },
        })(props => <div {...props} />);

        const wrapper = shallow(
            <InspectedComponent />,
            createFakeContextWithForm(),
        );

        expect(wrapper.props()).toEqual({ myProp: null });
    });

    it('should map rules\'s callback data to component prop if form exist', () => {
        const InspectedComponent = formInspector({
            form: 'myForm',
            fieldsToProps: { myProp: () => 'Hello' },
        })(reduxForm({
            form: 'myForm',
        })(props => <div {...props} />));

        const wrapper = shallow(
            <InspectedComponent />,
            createFakeContextWithForm({
                myForm: {
                    values: {},
                },
            }),
        );

        expect(wrapper.props()).toEqual({ myProp: 'Hello' });
    });

    it('should map data to custom "inspectorKey" prop key if provided', () => {
        const InspectedComponent = formInspector({
            form: 'myForm',
            fieldsToProps: { myProp: () => 'Hello' },
            inspectorKey: 'inspect',
        })(reduxForm({
            form: 'myForm',
        })(props => <div {...props} />));

        const wrapper = shallow(
            <InspectedComponent />,
            createFakeContextWithForm({
                myForm: {
                    values: {},
                },
            }),
        );

        expect(wrapper.props()).toEqual({ inspect: { myProp: 'Hello' } });
    });

    it('should access form fields values from inspector callback', () => {
        const inspectorSpy = expect.createSpy();

        const InspectedComponent = formInspector({
            form: 'myForm',
            fieldsToProps: { myProp: inspectorSpy },
        })(reduxForm({
            form: 'myForm',
        })(props => <div {...props} />));

        shallow(
            <InspectedComponent />,
            createFakeContextWithForm({
                myForm: {
                    values: {
                        myFieldKey: 'myFieldData',
                        myFieldKey2: 'myFieldData2',
                    },
                },
            }),
        );

        expect(inspectorSpy).toHaveBeenCalledWith({
            myFieldKey: 'myFieldData',
            myFieldKey2: 'myFieldData2',
        });
    });
});
