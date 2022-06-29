import Route from '@ember/routing/route';
import { waitForQuery } from '@gavant/ember-graphql/decorators';
import { useQuery } from '@gavant/ember-graphql/utils';

import { gql } from 'glimmer-apollo';

export const EXAMPLE_QUERY = gql`
    query GetFoo {
        foo {
            id
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

    @waitForQuery
    async model() {
        return this.query;
    }
}
