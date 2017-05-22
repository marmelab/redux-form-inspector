import React from 'react';

import { shallow } from 'enzyme';
import expect from 'expect';

import { reduxForm } from 'redux-form';
import { createStore } from 'redux';

import formInspector from './index';

const createFakeContextWithForm = (form = {}) => ({
    context: {
        store: createStore(v => v, {
            form,
        }),
    },
});

describe('formInspector', () => {
    it('should throw an error if no form name is provided in the configuration object', () => {
        expect(() => {
            formInspector({});
        }).toThrow('You must provide a form identifier in the "form" configuration key.');
    });

    it('should map empty object to "inspection" prop key if form does not exist', () => {
        const InspectedComponent = formInspector({
            form: 'myForm',
            rules: { myProp: () => 'Hello' },
        })(({ inspection }) => (
            <div {...inspection.customProps} />
        ));

        const wrapper = shallow(
            <InspectedComponent />,
            createFakeContextWithForm(),
        );

        expect(wrapper.prop('inspection')).toEqual({ myProp: {} });
    });

    it('should map data to "inspection" prop key if form exist', () => {
        const InspectedComponent = formInspector({
            rules: { myProp: () => 'Hello' },
            form: 'myForm',
        })(reduxForm({
            form: 'myForm',
        })(({ inspection }) => (
            <div {...inspection.customProps} />
        )));

        const wrapper = shallow(
            <InspectedComponent />,
            createFakeContextWithForm({
                myForm: {
                    values: {},
                },
            }),
        );

        expect(wrapper.prop('inspection')).toEqual({ myProp: 'Hello' });
    });

    it('should map data to custom "inspectorKey" prop key if provided', () => {
        const InspectedComponent = formInspector({
            rules: { myProp: () => 'Hello' },
            form: 'myForm',
            inspectorKey: 'inspect',
        })(reduxForm({
            form: 'myForm',
        })(({ inspect }) => (
            <div {...inspect.customProps} />
        )));

        const wrapper = shallow(
            <InspectedComponent />,
            createFakeContextWithForm({
                myForm: {
                    values: {},
                },
            }),
        );

        expect(wrapper.prop('inspect')).toEqual({ myProp: 'Hello' });
    });

    it('should access form fields values from inspector callback', () => {
        const inspectorSpy = expect.createSpy();

        const InspectedComponent = formInspector({
            rules: { myProp: inspectorSpy },
            form: 'myForm',
        })(reduxForm({
            form: 'myForm',
        })(({ inspection }) => (
            <div {...inspection.customProps} />
        )));

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
