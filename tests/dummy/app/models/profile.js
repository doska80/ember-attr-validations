import Model, { attr, hasMany } from '@ember-data/model';
import { inject as service } from '@ember/service';

export default class UserModel extends Model {
  @service session;

  @attr bio;
  @attr image;
  @attr following;

  @hasMany('article', { async: false, inverse: 'author' }) articles;
}
