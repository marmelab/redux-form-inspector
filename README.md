# redux-form-inspector

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

`redux-form-inspector` let you add some `dynamic props` to you component (wrapped by your HOC) who are based on the values of any registred form of your application. For example, you can disable fields, change the background color of your form, ... the sky's the limit.

```js
import React from 'react';
import formInspector from 'redux-form-inspector';
import { compose } from 'recompose';
import { Field, reduxForm } from 'redux-form';

export const helloFormRules = {
    bgColor: ({ message }) ? message.indexOf('hello') === -1 ? 'red' : 'blue',
    countChar: ({ message }) => message.length,
};

export const HelloForm = ({ handleSubmit, inspect }) => (
  <form onSubmit={handleSubmit} style={{ background: inspect.bgColor }}>
    <span>{{ inspect.countChar }} characters</span>
    <Field name="message" component="input" type="text"/>
    <button type="submit">Submit</button>
  </form>
);

export default compose(
    reduxForm({ form: 'hello' }),
    formInspector(helloFormRules, 'hello', 'inspect'),
)(HelloForm);
```

## API

The `formInspector` function take 3 arguments as input in the following way. In result of this call, it return a new HOC which can be used on any component (not even form).

```js
const myCustomFormInspector = formInspector(rules, formName [, inspectorKeyName]);
```

#### Rules

Rules are the most important part of `redux-form-inspector`. They are defined with a simple object with a prop name as key and a callback as value.

At runtime, each callback are executed with the form field values as arguments and each result is assigned to the following prop name.

The strength of the rules lies in fact they can be easily tested.

#### FormName

The form name must be the same as the name you have passed to the [reduxForm](http://redux-form.com/6.7.0/docs/api/ReduxForm.md/) on the form that you're inspect. In the previous example, the form name was `hello`.

#### InspectorKeyName [optionnal]

This args let you assign a custom name to the inspector result object which is passed as prop to your inspected component.

If not specified, `formInspector` will use `inspection` as name for this prop.

## Contributing

Run the tests with this command:

```sh
make test
```
