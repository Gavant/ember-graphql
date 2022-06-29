import { setupApolloClient } from '@gavant/ember-graphql/utils';

import ENV from 'test-app/config/environment';

export default {
    initialize: setupApolloClient({
        baseUri: ENV.graphql?.uri,
        client: {
            name: ENV.modulePrefix,
            version: ENV.APP.VERSION
        }
    })
};
