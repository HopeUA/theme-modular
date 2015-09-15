/**
 * Scheduler
 * @api
 *
 * Configure
 *     var scheduler = Hope.Api.Scheduler(endpoint);
 *
 * Methods
 *
 * - from(date)          start date and time (*required)
 * - to(date)            end date and time (default: end of the day)
 * - param(name, value)  custom query parameter
 * - getUrl()            return full url for request
 * - fetch()             send api request and return Promise.
 *
 * Examples
 *     var start = new Date(...);
 *     var end   = new Date(...);
 *     scheduler.from(start).to(end).fetch().then(function(data){
 *         // data - episode list
 *     }).catch(function(response){
 *         // response - response.status, response.json()
 *     });
 *
 */
(function(Hope){

    class Scheduler {
        constructor(endpoint) {
            this._endpoint = endpoint;
            this._resource = 'events';
            this._query    = {};
            this._method   = 'GET';
            this._body     = {};
        }

        count(dates) {
            let self = clone(this);
            self._method   = 'POST';
            self._resource = 'events/count';
            self._body     = {
                dates
            };

            return self;
        }

        from(date) {
            if (!(date instanceof Date)) {
                throw new TypeError('Invalid date ' + date);
            }

            return this.param('date', date.toISOString());
        }

        to(date) {
            if (!(date instanceof Date)) {
                throw new TypeError('Invalid date ' + date);
            }

            return this.param('dateEnd', date.toISOString());
        }

        param(name, value, createNew = true) {
            let self = createNew ? clone(this) : this;
            self._query[name] = value;

            return self;
        }

        fetch() {
            return new Promise((resolve, reject) => {
                let options = {
                    method: this._method
                };
                let headers = new Headers();
                if (this._method == 'POST') {
                    headers.append('Content-type', 'application/json');
                    options.body = JSON.stringify(this._body);
                }
                options.headers = headers;

                fetch(this.getUrl(), options).then((response) => {
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

            let url = URI(parts.join('/'));
            url.query(this._query);

            return url.toString();
        }
    }

    function Api(endpoint) {
        return new Scheduler(endpoint);
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
    Hope.Api.Scheduler = Api;
})(Hope);