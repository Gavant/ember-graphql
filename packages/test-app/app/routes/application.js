import Route from '@ember/routing/route';
import { waitForQuery } from '@gavant/ember-graphql';

export default class ApplicationRoute extends Route {
  async model() {
    waitForQuery();
  }
}
