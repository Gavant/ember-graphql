import Route from '@ember/routing/route';

export default class ApplicationRoute extends Route {
    error(errors) {
        console.log('ERROR!', errors);
    }
}
