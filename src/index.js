import { connect } from 'react-redux';
import { getFormValues } from 'redux-form';

export default ({ form, rules = {}, inspectorKey = 'inspection' }) => {
    if (!form) {
        throw new Error('You must provide a form identifier in the "form" configuration key.');
    }

    const FormInspectorComponent = BaseComponent => (
        connect((state) => {
            const fieldValues = getFormValues(form)(state);

            const inspection = Object.keys(rules).reduce((r, rule) => ({
                ...r,
                [rule]: fieldValues ? rules[rule](fieldValues) : {},
            }), {});

            return { [inspectorKey]: inspection };
        }, () => ({}))(BaseComponent)
    );

    return FormInspectorComponent;
};
