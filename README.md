# ember-attr-validations

Ember Attr Validations is an addon that allows to express and validate models constraints using ember's native decorate `@attr`.


## Features
* Simple setup
* Use the native decorate `@attr` to express the constraints.
* Ember-intl support
* Custom validators
* Synchronous and asynchronous support
* Hibernate inspired validators
* Clean and simple syntax in the template

## Compatibility

* Ember.js v3.28 or above
* Ember CLI v3.28 or above
* Ember Auto Import v2.0 or above
* Ember CLI Babel V7.26 or above
* Node.js v12 or above


## Installation

```
ember install ember-attr-validations
```


## Usage

### Setup the Model

Import the decorate `@validation` and configure the model with the constraints. The configuration is done directly in decorate `@atrr`.

```js
import Model, { attr } from '@ember-data/model';
import validation from 'ember-attr-validations';

@validation
export default class UserModel extends Model {
    
  @attr({ notBlank: 'Username is mandatory' })
  username;

  @attr({ email: 'This field must be a valid email address' })
  email;

  @attr({
    past: {
      dateFormat: 'DD/MM/YYYY',
      message: 'The date must be less than the current date',
    },
  })
  dateBirth;
}
```

Once the constraints have been added to the `model`, now in the template we can use the `<ListenErrors />` component to display errors. It is necessary to define the `attr attribute` inside the input with the same name as the `@attr attribute` component of `<ListenErrors />`. 
`<ListenErrors />` also support the use of blocks to allow customization

```html
<Input class="form-control" type="text" placeholder="Username" 
@value={{this.user.username}} attr="username" /> 
  
<ListenErrors @model={{this.user}} @attr="username" />
```

To perform the validation before the transaction, we need to use `this.model.validate()`, validate is a function created by the addon that will return true or false.

```js
@action
async save() {
  if (!this.user.validate()) return;
  await this.user.save();
}
```

It is possible to use `this.model.hasViolations` to know if the model has any violations.
```js
  get buttonIsDisabled() {
  return (
    !this.model.hasDirtyAttributes || this.model.isSaving 
    || this.model.hasViolations
  );
}
```

Alternatively, it is also possible to manage the events that trigger the validation and customize the error messages using the `attributeNameValid function`. The Addon creates a function for each attribute with the name of the `attribute + 'Valid'`.

```html
<Input class="form-control" type="text" placeholder="What's this article about?"
  @value={{this.article.description}} {{on "focusout" this.article.descriptionValid }} />

<ul class="error-messages">
  {{#each this.article.violations.description.list as |violation|}}
    <li data-test-error-item>{{violation}}</li>
  {{/each}}
</ul>
```

If you need to create some custom validation, use the `custom` type to create it. Custom validation is a function called `validation` that receives the `value` and the `reference` to the model as a parameter, in this way it is possible to perform asynchronous validations using the `store service`.
```js
  @attr({
  custom: {
      validation(value, model) {
       if (!!value && value !== model.email) {
        return 'Email addresses do not match';
       }
    },
  },
})
confirmEmail;
```
It is also possible to create custom asynchronous validations by defining a debounce time

```js
  @attr({
  notBlank: 'Title is mandatory',
  custom: {
    async validation(value, model) {
      if (value) {
        const articles = await model.store.query('article', { title: value });
        return articles.length > 0 ? `Name ${value} already exists` : undefined;
      }
    },
    debounce: 500,
  },
})
title;
```


### Ember Intl Support

To use **Ember-Intl** for validations, just add the code snippet below to your project's **/config/environment.js** file
```js
'ember-attr-validations': {
  emberIntl: true,
},
```
And then the **Ember-Intl** constant can be passed directly in the validation
```js
@attr({ notBlank: 'app.username.mandatory' })
username;
```
if there are parameters, we can pass the key/value
```js
@attr({notBlank: {key:'_application.validation.notBlank', value:{ field: 'username' }}})
username;
```

## Validations
|   Validation    |                                                      Example                                                      |                                                                                            Description                                                                                             |
|:---------------:|:-----------------------------------------------------------------------------------------------------------------:|:--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|
|    notBlank     |                                     `@attr({ notBlank: 'notBlank message' })`                                     |                                                 Checks that the annotated character sequence is not null and the trimmed length is greater than 0.                                                 |
|     digits      |                                       `@attr({ digits: 'digits message' })`                                       |                                             Checks whether the annotated value is a number having up to integer digits and fraction fractional digits.                                             |
|       min       |                              `@attr({ min: { value: 5, message: 'Min message' } })`                               |                                                        Checks whether the annotated value is higher than or equal to the specified minimum.                                                        |
|       max       |                              `@attr({ max: { value: 5, message: 'Max message' } })`                               |                                                         Checks whether the annotated value is less than or equal to the specified maximum.                                                         |
|     length      |                          `@attr({length: {min: 5, max: 10, message: 'length message'}})`                          | Validates that the annotated character sequence is between min and max included or character sequence has a minimum or maximum number of characters if the `min` or `max` parameter is not passed. |
|      range      |                           `@attr({range: {min: 5, max: 10, message: 'range message'}})`                           |                                                   Checks whether the annotated value lies between (inclusive) the specified minimum and maximum.                                                   |
|      email      |                                        `@attr({ email: 'email message' })`                                        |                                                             Checks whether the specified character sequence is a valid email address.                                                              |
|       url       |                                          `@attr({ url: 'url message' })`                                          |                                                                     Checks if the annotated character sequence is a valid URL.                                                                     |
|    positive     |                                     `@attr({ positive: 'positive message' })`                                     |                                                          Checks if the element is strictly positive. Zero values are considered invalid.                                                           |
| PositiveOrZero  |                                  `@attr({ positiveOrZero: 'positive message' })`                                  |                                                                             Checks if the element is positive or zero.                                                                             |
|    negative     |                                     `@attr({ negative: 'negative message' })`                                     |                                                          Checks if the element is strictly negative. Zero values are considered invalid.                                                           |
| negativeOrZero  |                               `@attr({ negativeOrZero: 'negativeOrZero message' })`                               |                                                                             Checks if the element is negative or zero.                                                                             |
|      past       |                     `@attr({ past: { dateFormat: 'DD/MM/YYYY', message: 'past message' } })`                      |                                                                         Checks whether the annotated date is in the past.                                                                          |
|  pastOrPresent  |                 `@attr({ pastOrPresent: { dateFormat: 'DD/MM/YYYY', message: 'past message' } })`                 |                                                                Checks whether the annotated date is in the past or in the present.                                                                 |
|     future      |                   `@attr({ future: { dateFormat: 'DD/MM/YYYY', message: 'future message' } })`                    |                                                                        Checks whether the annotated date is in the future.                                                                         |
| futureOrPresent |               `@attr({ futureOrPresent: { dateFormat: 'DD/MM/YYYY', message: 'future message' } })`               |                                                               Checks whether the annotated date is in the present or in the future.                                                                |
|     custom      | `@attr({custom: {validation(value, model) {if (!!value && value !== model.email) { return 'custom message';}}}})` |                                                                                         Custom validation.                                                                                         |

## See example with code snippet
- ### [Live Demo](https://doska80.github.io/ember-attr-validations)
## Contributing

See the [Contributing](CONTRIBUTING.md) guide for details.


## License

This project is licensed under the [MIT License](LICENSE.md).
