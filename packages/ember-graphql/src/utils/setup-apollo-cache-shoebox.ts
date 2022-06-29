import ApplicationInstance from '@ember/application/instance';

import FastbootService from 'ember-cli-fastboot/services/fastboot';
import { getClient } from 'glimmer-apollo';

/**
 * When run on application initialization, this will extract Apollo's current cache data
 * into the FastBoot Shoebox when run in FastBoot, and will restore Apollo's cache with
 * the data stored in the Shoebox when run on the client-side.
 * @param context ApplicationInstance
 */
export function setupApolloCacheShoebox(context: ApplicationInstance): void {
    const fastboot = context.lookup('service:fastboot') as FastbootService;
    const apolloCache = getClient(context).cache;
    const shoebox = fastboot.get('shoebox');

    if (fastboot.isFastBoot) {
        // create a shoebox entry with a getter, so that the cache isn't actually
        // extracted until fastboot serializes the shoebox contents into the page
        // AFTER all the apollo queries have resolved.
        shoebox.put('apollo-cache', {
            get cache(): unknown {
                return apolloCache.extract();
            }
        });
    } else {
        const cacheContents = shoebox.retrieve('apollo-cache') as unknown as { cache: unknown };
        if (cacheContents?.cache) {
            apolloCache.restore(cacheContents.cache);
        }
    }
}
