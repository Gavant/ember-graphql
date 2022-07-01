import { setupApolloClient } from '@gavant/ember-graphql/utils';

import fetch from 'fetch';

import ENV from 'test-app/config/environment';

export default {
    initialize: setupApolloClient({
        fetch,
        baseUri: ENV.graphql?.uri,
        client: {
            name: ENV.modulePrefix,
            version: ENV.APP.VERSION
        }
    })
};
