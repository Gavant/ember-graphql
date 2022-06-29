import { setupApolloCacheShoebox } from '@gavant/ember-graphql/utils';

export default {
    initialize: setupApolloCacheShoebox,
    after: 'graphql'
};
