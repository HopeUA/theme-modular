(function(Hope){

    class Media {
        constructor(endpoint) {
            this._endpoint = endpoint;
            this._resource = null;
            this._module   = null;
            this._filter   = {};
            this._query    = {};
            this._format   = 'json';
            this._code     = null;
        }

        episodes(module = '') {
            let self = clone(this);
            if (module) {
                self._module = module;
            }
            self._resource = 'episodes';

            return self;
        }

        shows(module = '') {
            let self = clone(this);
            if (module) {
                self._module = module;
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
            return fetch(this.getUrl()).then((response) => {
                if (response.status != 200) {
                    throw response;
                }

                let type = response.headers.get('Content-Type').replace(/([^;]+).*/, '$1');

                if (type == 'application/json') {
                    return response.json();
                } else {/**/
                    return response.text();
                }
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
            if (this._module) {
                parts.push(this._module);
            }

            let url = URI(parts.join('/'));
            url.query(this._query);

            return url.toString();
        }
    }

    function Api(endpoint) {
        return new Media(endpoint);
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
    Hope.Api.Media = Api;

})(Hope);