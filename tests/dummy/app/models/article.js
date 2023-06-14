// BEGIN-SNIPPET article-model
import Model, { attr, belongsTo, hasMany } from '@ember-data/model';
import validation from 'ember-attr-validations';

@validation
export default class ArticleModel extends Model {
  @attr({
    notBlank: 'Title is mandatory',
    length: {
      min: 5,
      max: 20,
      message: 'Title must be between 5 and 30 characters',
    },
  })
  title;

  @attr({
    notBlank: 'Description is mandatory',
    length: {
      max: 50,
      message: 'Description must be max 50 characters',
    },
  })
  description;

  @attr({
    length: { min: 5, message: 'Article must be at least 5 characters long' },
  })
  body;

  @belongsTo('profile')
  author;

  @hasMany('comment', { async: false })
  comments;
}
// END-SNIPPET
