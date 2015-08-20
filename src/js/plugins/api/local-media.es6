/*
 * Local Media
 * @api
 *
 * Configure
 *     var media = LocalMediaAPI(endpoint);
 *
 * Methods
 *
 * - episodes(module)    module name
 * - offset(n)
 * - limit(n)
 * - format(f)           response format (default: json)
 * - param(name, value)  custom query parameter
 * - getUrl()            return full url for request
 * - fetch()             send api request and return Promise.
 *
 * Example
 *     var episodes = media.episodes(module).format('html');
 *     episodes.limit(10).offset(5).fetch().then(function(data){
 *         // data - episode list
 *     }).catch(function(response){
 *         // response - response.status, response.json()
 *     });
 *
 */
(function(Hope){

    class LocalMedia {
        constructor(endpoint) {
            this.endpoint = endpoint;
            this.resource = null;
            this.query    = {};
            this.format   = 'json';
        }

        episodes(module) {
            let self = this.param('module', module);
            self.resource = 'episodes';

            return self;
        }

        offset(n) {
            return this.param('offset', n);
        }

        limit(n) {
            return this.param('limit', n);
        }

        format(f) {
            let self = clone(this);
            self.format = f;

            return self;
        }

        param(name, value) {
            let self = clone(this);
            self.query[name] = value;

            return self;
        }

        fetch() {
            return fetch(this.getUrl()).then((response) => {
                if (response.status != 200) {
                    throw response;
                }

                let type = response.headers.get('Content-Type').replace(/([^;]+).*/, '$1');

                if (type == 'application/json') {
                    return response.json();
                } else {
                    return response.text();
                }
            });
        }

        getUrl() {
            let url = URI(this.endpoint + '/' + this.resource);
            url.suffix(this.format);
            url.query(this.query);

            return url.toString();
        }

    }

    function Api(endpoint) {
        return new LocalMedia(endpoint);
    }

    function clone(obj) {
        return Object.assign(LocalMedia.prototype, obj);
    }

    Hope.Api = Hope.Api || {};
    Hope.Api.LocalMedia = Api;

})(Hope);
