(function(Hope){
    class Thumbs {
        constructor(endpoint) {
            this._endpoint = endpoint;
            this._token    = 'unsafe';
        }

        getUrl(image, width, height) {
            if (this._endpoint == null) {
                throw new TypeError('Endpoint is not defined');
            }

            let parts = [this._endpoint, this._token, width + 'x' + height , image];

            let url = URI(parts.join('/'));
            url.query(this._query);

            return url.toString();
        }
    }

    function Api(endpoint) {
        return new Thumbs(endpoint);
    }

    Hope.Api = Hope.Api || {};
    Hope.Api.Thumbs = Api;
})(Hope);