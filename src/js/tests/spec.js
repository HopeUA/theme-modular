describe('LocalMedia API', function() {
    var endpoint = 'http://hope.api/v1';

    it('should be defined', function() {
        expect(Hope.Api.LocalMedia).to.be.a('function');
    });

    it('should set Episodes Resource', function() {
        var api = Hope.Api.LocalMedia(endpoint).episodes();

        expect(api.getUrl()).to.be.equal(endpoint + '/episodes.json');
    });

    it('should set module query param for Episode Resource', function() {
        var api = Hope.Api.LocalMedia(endpoint).episodes('someModule');

        expect(api.getUrl()).to.be.equal(endpoint + '/episodes.json?module=someModule');
    });

    it('should add custom query param', function() {
        var api = Hope.Api.LocalMedia(endpoint).episodes();
        var apiParam1 = api.param('key1', 'val1');
        var apiParam2 = api.param('key2', 'val2');

        expect(apiParam1.getUrl()).to.be.equal(endpoint + '/episodes.json?key1=val1');
        expect(apiParam2.getUrl()).to.be.equal(endpoint + '/episodes.json?key2=val2');
    });

    it('should add "limit" query param', function() {
        var api = Hope.Api.LocalMedia(endpoint).episodes().limit(10);

        expect(api.getUrl()).to.be.equal(endpoint + '/episodes.json?limit=10');
    });

    it('should add "offset" query param', function() {
        var api = Hope.Api.LocalMedia(endpoint).episodes().offset(10);

        expect(api.getUrl()).to.be.equal(endpoint + '/episodes.json?offset=10');
    });

    it('should set response format', function() {
        var api = Hope.Api.LocalMedia(endpoint).episodes().format('html');

        expect(api.getUrl()).to.be.equal(endpoint + '/episodes.html');
    });

    it('should set Episode Code', function() {
        var api = Hope.Api.LocalMedia(endpoint).episodes().code('someCode');

        expect(api.getUrl()).to.be.equal(endpoint + '/episodes/someCode.json');
    });

    it('should pass different tests', function() {
        var api = Hope.Api.LocalMedia(endpoint).episodes('someModule');
        var api1 = api.offset(10).limit(5).offset(5);
        var api2 = api1.limit(10).param('key1', 'val1');
        var api3 = api1.param('key2', 'val2');
        var api4 = api2.param('key3', 'val3');

        expect(api1.getUrl()).to.be.equal(endpoint + '/episodes.json?module=someModule&offset=5&limit=5');
        expect(api2.getUrl()).to.be.equal(endpoint + '/episodes.json?module=someModule&offset=5&limit=10&key1=val1');
        expect(api3.getUrl()).to.be.equal(endpoint + '/episodes.json?module=someModule&offset=5&limit=5&key2=val2');
        expect(api4.getUrl()).to.be.equal(endpoint + '/episodes.json?module=someModule&offset=5&limit=10&key1=val1&key3=val3');
    });
});
