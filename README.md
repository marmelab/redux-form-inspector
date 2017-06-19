# redux-form-inspector

[![Build Status](https://travis-ci.org/marmelab/redux-form-inspector.svg?branch=master)](https://travis-ci.org/marmelab/redux-form-inspector)

An HOC for computing dynamic props from values inside an existing [redux-form](https://github.com/erikras/redux-form) component.

- [Installation](#installation)
- [Usage](#installation)
- [API](#api)

## Installation

Install with:

```sh
npm install -S redux-form-inspector
```

or

```sh
yarn add redux-form-inspector
```

## Usage

[Redux-form](https://github.com/erikras/redux-form) is a fantastic library which let you create forms inside your react application. In the following example, we create a simple form component with `hello` as an unique identifier thanks to the [reduxForm](http://redux-form.com/6.7.0/docs/api/ReduxForm.md/) HOC .

```js
import React from 'react';
import { Field, reduxForm } from 'redux-form';

export const HelloForm = ({ handleSubmit }) => (
  <form onSubmit={handleSubmit}>
    <Field name="message" component="input" type="text"/>
    <button type="submit">Submit</button>
  </form>
);

export default reduxForm({ form: 'hello' })(HelloForm);
```

`redux-form-inspector` let you add some `dynamic props` to you component (wrapped by your HOC) who are based on the values `of any registered form` of your application. For example, you can disable fields, change the background color of your form, ... the sky is the limit.

```js
import React from 'react';
import { compose } from 'recompose';
import { Field, reduxForm } from 'redux-form';
import formInspector from 'redux-form-inspector';

export const HelloForm = ({ handleSubmit, backgroundColor, showSecret }) => (
  <form onSubmit={handleSubmit} style={{ backgroundColor }}>
    {showSecret && <span>Hello John</span>}
    <Field name="email" component="input" type="text"/>
    <Field name="message" component="input" type="text"/>
    <button type="submit">Submit</button>
  </form>
);

export const fieldsToProps = {
    backgroundColor: ({ message }) => message.includes('hello') ? 'red' : 'blue',
    showSecret: ({ message, email }) => message.length > 0 && email === 'john@doe.com'
};

export default compose(
    reduxForm({ form: 'hello' }),
    formInspector({ form: 'hello', fieldsToProps }),
)(HelloForm);
```

## API

The `formInspector` function take a configuration object of the following form as input. In result of this call, it return a new HOC which can be used on any component (not just form).

```js
const fieldsToProps = {
    mySubprop: (fields, errors) => { ... },
    ...
};

const myCustomFormInspector = formInspector({
    form: 'myForm', // The redux-form instance identifier
    fieldsToProps, // An empty object by default
    inspectorKey: 'myInspectorPropKey' // [optionnal] no "sub-prop" by default
});
```

#### form

The form name must be the same as the name you have passed to the [reduxForm](http://redux-form.com/6.7.0/docs/api/ReduxForm.md/) on the form that you're inspect. In the previous example, the form name was `hello`.

If the provided form name does not exist or is not registred by `redux-form`, each value of the resulting `fieldsToProps` object will be equal to `null`.

#### fieldsToProps

`fieldsToProps` is the most important part of `redux-form-inspector`. It is defined as a simple object with a prop name as key and a callback as value. At runtime, each callback is executed with the form field values and errors (both sync and async) as arguments. Each result is assigned to the following prop name.

The strength of `fieldsToProps` lies in the fact that it can be easily tested.

#### inspectorKey [optionnal]

This attribute let you assign a custom root key for your `fieldsToProps` result object.

If not specified, `formInspector` will merge the `fieldsToProps` result object inside your existing component props.

## Contributing

Run the tests with this command:

```sh
make test
```
