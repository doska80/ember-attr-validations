import Model, { attr } from '@ember-data/model';
import { inject as service } from '@ember/service';
import validation from 'ember-attr-validations';
@validation
export default class UserModel extends Model {
  @service store;

  @attr
  bio;

  @attr({ notBlank: 'Title is mandatory', email: 'email invalid' })
  email;

  @attr({
    notBlank: 'URL Image is mandatory',
    url: 'URL Not Valid',
  })
  image;

  @attr({
    notBlank: 'Password is mandatory',
    length: {
      min: 4,
      max: 8,
      message: 'Password must be between 4 and 8 characters',
    },
    custom: {
      validation(value) {
        if (!!value && !/[A-Z]/.test(value)) {
          return 'The password must have at least one uppercase letter';
        }
      },
    },
  })
  password;

  @attr
  token;

  @attr({
    notBlank: 'Username is mandatory',
    length: {
      min: 4,
      max: 8,
      message: 'Username must be between 5 and 10 characters',
    },
    custom: {
      validation(value, model) {
        if (value) {
          const users = model.store
            .peekAll('user')
            .filter((user) => user.name === value);
          return users.length
            ? `A User named ${value} already exists`
            : undefined;
        }
      },
    },
  })
  username;

  @attr('date')
  createdAt;

  @attr('date')
  updatedAt;
}
