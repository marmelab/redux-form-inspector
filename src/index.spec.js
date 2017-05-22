import React from 'react';

import { shallow } from 'enzyme';
import expect from 'expect';

import { reduxForm } from 'redux-form';
import { createStore } from 'redux';

import FormInspector from './index';

const createFakeContextWithForm = (form = {}) => ({
    context: {
        store: createStore(v => v, {
            form,
        }),
    },
});

describe('FormInspector', () => {
    it('should map empty object to "inspection" prop key if form does not exist', () => {
        const InspectedComponent = FormInspector(
            { myProp: () => 'Hello' },
        )(({ inspection }) => (
            <div {...inspection.customProps} />
        ));

        const wrapper = shallow(
            <InspectedComponent />,
            createFakeContextWithForm(),
        );

        expect(wrapper.props().inspection).toEqual({ myProp: {} });
    });

    it('should map data to "inspection" prop key if form exist', () => {
        const InspectedComponent = FormInspector(
            { myProp: () => 'Hello' },
            'myForm',
        )(reduxForm({
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

        expect(wrapper.props().inspection).toEqual({ myProp: 'Hello' });
    });

    it('should access form fields values from inspector callback', () => {
        const inspectorSpy = expect.createSpy();

        const InspectedComponent = FormInspector(
            { myProp: inspectorSpy },
            'myForm',
        )(reduxForm({
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
