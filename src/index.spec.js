import React from 'react';
import Enzyme, { shallow, mount } from 'enzyme';
import { reduxForm } from 'redux-form';
import { createStore } from 'redux';
import Adapter from 'enzyme-adapter-react-16';
import { Provider } from 'react-redux';

Enzyme.configure({ adapter: new Adapter() });

import formInspector from './index';

const createFormStore = form => createStore(v => v, { form });

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

        const store = createFormStore({
            myForm: {
                asyncErrors: {},
                syncErrors: {},
            },
        });

        const wrapper = mount(
            <Provider store={store}>
                <InspectedComponent />
            </Provider>,
        );

        expect(wrapper.find('div').props()).toMatchObject({ myProp: null });
    });

    it("should map rules's callback data to component prop if form exist", () => {
        const InspectedComponent = formInspector({
            form: 'myForm',
            fieldsToProps: { myProp: () => 'Hello' },
        })(reduxForm({
            form: 'myForm',
        })(props => <div {...props} />));

        const store = createFormStore({
            myForm: {
                asyncErrors: {},
                syncErrors: {},
                values: {},
            },
        });

        const wrapper = mount(
            <Provider store={store}>
                <InspectedComponent />
            </Provider>,
        );

        expect(wrapper.find('div').props()).toMatchObject({ myProp: 'Hello' });
    });

    it('should map data to custom "inspectorKey" prop key if provided', () => {
        const InspectedComponent = formInspector({
            form: 'myForm',
            fieldsToProps: { myProp: () => 'Hello' },
            inspectorKey: 'inspect',
        })(reduxForm({
            form: 'myForm',
        })(props => <div {...props} />));

        const store = createFormStore({
            myForm: {
                asyncErrors: {},
                syncErrors: {},
                values: {},
            },
        });

        const wrapper = mount(
            <Provider store={store}>
                <InspectedComponent />
            </Provider>,
        );

        expect(wrapper.find('div').props()).toMatchObject({ inspect: { myProp: 'Hello' } });
    });

    it('should access form fields values and (a)sync errors from inspector callback', () => {
        const inspectorSpy = jest.fn();

        const InspectedComponent = formInspector({
            form: 'myForm',
            fieldsToProps: { myProp: inspectorSpy },
        })(reduxForm({
            form: 'myForm',
        })(props => <div {...props} />));

        const store = createFormStore({
            myForm: {
                asyncErrors: {
                    myFieldKey2: 'No record found',
                },
                syncErrors: {
                    myFieldKey: 'Required field',
                },
                values: {
                    myFieldKey: 'myFieldData',
                    myFieldKey2: 'myFieldData2',
                },
            },
        });

        mount(
            <Provider store={store}>
                <InspectedComponent />
            </Provider>,
        );

        expect(inspectorSpy.mock.calls[0]).toEqual([
            {
                myFieldKey: 'myFieldData',
                myFieldKey2: 'myFieldData2',
            }, {
                myFieldKey: 'Required field',
                myFieldKey2: 'No record found',
            },
        ]);
    });
});
