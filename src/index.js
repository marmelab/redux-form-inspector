import { connect } from 'react-redux';
import { getFormValues } from 'redux-form';

export default (rules, formName, inspectorKey = 'inspection') => {
    const FormInspectorComponent = BaseComponent => (
        connect((state) => {
            const fieldValues = getFormValues(formName)(state);

            const inspection = Object.keys(rules).reduce((r, rule) => ({
                ...r,
                [rule]: fieldValues ? rules[rule](fieldValues) : {},
            }), {});

            return { [inspectorKey]: inspection };
        }, () => ({}))(BaseComponent)
    );

    return FormInspectorComponent;
};
