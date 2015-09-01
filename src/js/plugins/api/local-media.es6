/**
 * Local Media
 * @api
 *
 * Configure
 *     var media = LocalMediaAPI(endpoint);
 *
 * Methods
 *
 * - episodes(module)
 * - shows(module)
 * - code(c)             resource code
 * - offset(n)
 * - limit(n)
 * - param(name, value)  custom query parameter
 * - getUrl()            return full url for request
 * - fetch()             send api request and return Promise.
 *
 * Example
 *     var episodes = media.episodes('new');
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
 *     var shows = media.shows('popular');
 *     shows.fetch().then(function(data){
 *         // data - episode object
 *     }).catch(function(response){
 *         // response - response.status, response.json()
 *     });
 *
 *
 */
(function(Hope){

    class LocalMedia {
        constructor(endpoint) {
            this._endpoint = endpoint;
            this._resource = null;
            this._query    = {};
            this._format   = 'json';
            this._code     = null;
        }

        episodes(module = '') {
            let self = clone(this);
            if (module) {
                self.param('module', module, false);
            }
            self._resource = 'episodes';

            return self;
        }

        shows(module = '') {
            let self = clone(this);
            if (module) {
                self.param('module', module, false);
            }
            self._resource = 'shows';

            return self;
        }

        code(code) {
            let self = clone(this);
            self._code = code;

            return self;
        }

        search(text) {
            return this.param('search', text);
        }

        offset(n) {
            return this.param('offset', n);
        }

        limit(n) {
            return this.param('limit', n);
        }

        param(name, value, createNew = true) {
            let self = createNew ? clone(this) : this;
            self._query[name] = value;

            return self;
        }

        fetch() {
            return new Promise((resolve, reject) => {
                fetch(this.getUrl()).then((response) => {
                    if (response.status != 200) {
                        return reject(response);
                    }

                    let type = response.headers.get('Content-Type').replace(/([^;]+).*/, '$1');

                    if (type == 'application/json') {
                        return resolve(response.json());
                    } else {
                        return resolve(response.text());
                    }
                });
            });
        }

        getUrl() {
            if (this._endpoint == null) {
                throw new TypeError('Endpoint is not defined');
            }
            if (this._resource == null) {
                throw new TypeError('API resource is not defined');
            }

            let parts = [this._endpoint, this._resource];
            if (this._code) {
                parts.push(this._code);
            }

            let url = URI(parts.join('/'));
            url.suffix(this._format);
            url.query(this._query);

            return url.toString();
        }
    }

    function Api(endpoint) {
        return new LocalMedia(endpoint);
    }

    function clone(obj) {
        let newObj = new obj.constructor();

        for (let prop in obj) {
            let value = obj[prop];
            if (value != null && typeof value == 'object') {
                newObj[prop] = clone(value);
            } else {
                newObj[prop] = value;
            }
        }

        return newObj;
    }

    Hope.Api = Hope.Api || {};
    Hope.Api.LocalMedia = Api;

})(Hope);
