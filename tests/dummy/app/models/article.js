import Model, { attr, belongsTo, hasMany } from '@ember-data/model';
import { inject as service } from '@ember/service';
import validation from 'ember-attr-validations';

@validation
export default class ArticleModel extends Model {
  @service session;

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

  @attr({ length: { min: 5, message: 'Min Body is 5' } })
  body;

  @attr('date')
  createdAt;

  @attr('date')
  updatedAt;

  @attr
  favorited;

  @attr
  favoritesCount;
  @attr({ defaultValue: () => [] }) tagList;

  @belongsTo('profile')
  author;

  @hasMany('comment', { async: false })
  comments;
}
