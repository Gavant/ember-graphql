import Route from '@ember/routing/route';
// import { waitForQuery } from '@gavant/ember-graphql/decorators';
import { useQuery } from '@gavant/ember-graphql/utils';

import { gql } from 'glimmer-apollo';

export const EXAMPLE_QUERY = gql`
    query GetUsers {
        users {
            meta {
                totalCount
            }
            data {
                id
                name
                email
            }
        }
    }
`;

export default class ApplicationRoute extends Route {
    query = useQuery(this, () => [
        EXAMPLE_QUERY,
        {
            variables: {}
        }
    ]);

    // @waitForQuery
    async model() {
        return this.query;
    }
}
