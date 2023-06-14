import Model, { attr } from '@ember-data/model';
import validation from 'ember-attr-validations';

@validation
export default class UserModel extends Model {

    @attr({
    notBlank: 'Username is mandatory',
    length: {
      min: 5,
      max: 10,
      message: 'Username must be between 5 and 10 characters',
    },
  })
  username;

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

  @attr({ email: 'This field must be a valid email address' })
  email;

  @attr({ 
    email: 'This field must be a valid email address',
    custom: {
      validation(value, model) {
        if (!!value && value !== model.email) {
          return 'Email addresses do not match';
        }
      },
    }, 
  })
  confirmEmail;

  @attr({ notBlank: 'The first name can\'t be blank' })
  firstName;

  @attr({ notBlank: 'The last name can\'t be blank' })
  lastName;

  @attr({ past: { dateFormat: 'DD/MM/YYYY', message: 'The date must be less than the current date' } })
  dateBirth;

  @attr({ digits: 'This field must be a numbers' })
  phone;

  @attr({ url: 'This field must be a valid url' })
  url;



  @attr
  bio;

  @attr({
    notBlank: 'URL Image is mandatory',
    url: 'URL Not Valid',
  })
  image;

  @attr
  token;

  @attr('date')
  createdAt;

  @attr('date')
  updatedAt;
}
