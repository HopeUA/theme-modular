(function(Hope){

    class Articles {
        constructor(endpoint) {
            this._endpoint = endpoint;
            this._resource = 'articles';
            this._query    = {};
            this._method   = 'GET';
            this._body     = {};
            this._format   = 'json';
        }

        category(cat) {
            return this.param('category', cat);
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
        return new Articles(endpoint);
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
    Hope.Api.LocalArticles = Api;
})(Hope);