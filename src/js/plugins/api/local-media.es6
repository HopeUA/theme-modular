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
 * - code(c)             resource code
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
 *     var episodes = media.episodes();
 *     episodes.code('MBCU00115').fetch().then(function(data){
 *         // data - episode object
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
            this._format  = 'json';
            this._code    = null;
        }

        episodes(module = '') {
            let self = clone(this);
            if (module) {
                self.module = module;
            }
            self.resource = 'episodes';

            return self;
        }

        code(c) {
            let self = clone(this);
            self._code = c;

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
            self._format = f;

            return self;
        }

        param(name, value) {
            let self = clone(this);
            self.query[name] = value;

            return self;
        }

        fetch() {
            if (this.endpoint == null) {
                throw new TypeError('Endpoint is not defined');
            }
            if (this.resource == null) {
                throw new TypeError('API resource is not defined');
            }

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
            let parts = [this.endpoint, this.resource];
            if (this._code != null) {
                parts.push(this._code);
            }

            let url = URI(parts.join('/'));
            url.suffix(this._format);
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
