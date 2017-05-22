import { connect } from 'react-redux';
import { getFormValues } from 'redux-form';

export default ({ form, fieldsToProps = {}, inspectorKey }) => {
    if (!form) {
        throw new Error('You must provide a form identifier in the "form" configuration key.');
    }

    const FormInspectorComponent = BaseComponent => (
        connect((state) => {
            const fieldValues = getFormValues(form)(state);

            const inspection = Object.keys(fieldsToProps).reduce((r, prop) => ({
                ...r,
                [prop]: fieldValues ? fieldsToProps[prop](fieldValues) : null,
            }), {});

            return !inspectorKey ? inspection : { [inspectorKey]: inspection };
        }, () => ({}))(BaseComponent)
    );

    return FormInspectorComponent;
};
