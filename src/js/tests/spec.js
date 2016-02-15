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

    it('should set Episode Code', function() {
        var api = Hope.Api.LocalMedia(endpoint).episodes().code('someCode');

        expect(api.getUrl()).to.be.equal(endpoint + '/episodes/someCode.json');
    });

    it('should set "search" query param', function() {
        var api = Hope.Api.LocalMedia(endpoint).episodes().search('some text string');

        expect(api.getUrl()).to.be.equal(endpoint + '/episodes.json?search=some+text+string');
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

describe('Media API', function(){
    var endpoint = 'http://hope.api/v1';

    it('should be defined', function() {
        expect(Hope.Api.Media).to.be.a('function');
    });

    it('should set Episodes Resource', function() {
        var api = Hope.Api.Media(endpoint).episodes();

        expect(api.getUrl()).to.be.equal(endpoint + '/episodes');
    });

    it('should set module param for Episode Resource', function() {
        var api = Hope.Api.Media(endpoint).episodes('someModule');

        expect(api.getUrl()).to.be.equal(endpoint + '/episodes/someModule');
    });

    it('should add custom query param', function() {
        var api = Hope.Api.Media(endpoint).episodes();
        var apiParam1 = api.param('key1', 'val1');
        var apiParam2 = api.param('key2', 'val2');

        expect(apiParam1.getUrl()).to.be.equal(endpoint + '/episodes?key1=val1');
        expect(apiParam2.getUrl()).to.be.equal(endpoint + '/episodes?key2=val2');
    });

    it('should add custom filter param', function() {
        var api = Hope.Api.Media(endpoint).episodes();
        var apiParam1 = api.filter('key1', 'val1');
        var apiParam2 = api.filter('key2', 'val2');

        expect(apiParam1.getUrl()).to.be.equal(endpoint + '/episodes?filter=' + encodeURIComponent('{"key1":"val1"}'));
        expect(apiParam2.getUrl()).to.be.equal(endpoint + '/episodes?filter=' + encodeURIComponent('{"key2":"val2"}'));
    });

    it('should add "limit" query param', function() {
        var api = Hope.Api.Media(endpoint).episodes().limit(10);

        expect(api.getUrl()).to.be.equal(endpoint + '/episodes?filter=' + encodeURIComponent('{"limit":10}'));
    });

    it('should add "offset" query param', function() {
        var api = Hope.Api.Media(endpoint).episodes().offset(10);

        expect(api.getUrl()).to.be.equal(endpoint + '/episodes?filter=' + encodeURIComponent('{"offset":10}'));
    });

    it('should set Episode Code', function() {
        var api = Hope.Api.Media(endpoint).episodes().code('someCode');

        expect(api.getUrl()).to.be.equal(endpoint + '/episodes/someCode');
    });

    it('should set "search" query param', function() {
        var api = Hope.Api.Media(endpoint).episodes().search('some text string');

        expect(api.getUrl()).to.be.equal(endpoint + '/episodes?search=some+text+string');
    });

    it('should pass different tests', function() {
        var api = Hope.Api.Media(endpoint).episodes('someModule');
        var api1 = api.offset(10).limit(5).offset(5);
        var api2 = api1.limit(10).param('key1', 'val1');
        var api3 = api1.param('key2', 'val2');
        var api4 = api2.param('key3', 'val3');

        // expect(api1.getUrl()).to.be.equal(endpoint + '/episodes?filter=' + encodeURIComponent('{"offset":5,"limit":5}'));
        // expect(api2.getUrl()).to.be.equal(endpoint + '/episodes/someModule?filter=' + encodeURIComponent('{"offset":5,"limit":5}'));
        // expect(api3.getUrl()).to.be.equal(endpoint + '/episodes/someModule?offset=5&limit=5&key2=val2');
        // expect(api4.getUrl()).to.be.equal(endpoint + '/episodes/someModule?offset=5&limit=10&key1=val1&key3=val3');
    });
});

describe('Scheduler API', function(){
    var endpoint = 'https://scheduler.s.hope.ua/v1';

    it('should be defined', function() {
        expect(Hope.Api.Scheduler).to.be.a('function');
    });

    it('should set Events Resource', function() {
        var api = Hope.Api.Scheduler(endpoint);

        expect(api.getUrl()).to.be.equal(endpoint + '/events');
    });

    it('should add custom query param', function() {
        var api = Hope.Api.Scheduler(endpoint);
        var apiParam1 = api.param('key1', 'val1');
        var apiParam2 = api.param('key2', 'val2');

        expect(apiParam1.getUrl()).to.be.equal(endpoint + '/events?key1=val1');
        expect(apiParam2.getUrl()).to.be.equal(endpoint + '/events?key2=val2');
    });

    it('should add "date" query param', function() {
        var date = new Date();
        var api  = Hope.Api.Scheduler(endpoint).from(date);

        expect(api.getUrl()).to.be.equal(endpoint + '/events?date=' + encodeURIComponent(date.toISOString()));
    });

    it('should add "dateEnd" query param', function() {
        var date = new Date();
        var api  = Hope.Api.Scheduler(endpoint).to(date);

        expect(api.getUrl()).to.be.equal(endpoint + '/events?dateEnd=' + encodeURIComponent(date.toISOString()));
    });

    it('should throw error on invalid date', function() {
        var date = 'Invalid date';
        var api  = Hope.Api.Scheduler(endpoint);

        expect(function() {
            api.from(date)
        }).to.throw(TypeError);
    });

    it('should construct "count" url', function(done) {
        var dates = [
            '2015-09-05',
            '2015-09-06'
        ];
        var api = Hope.Api.Scheduler(endpoint).count(dates);

        expect(api.getUrl()).to.be.equal(endpoint + '/events/count');
        api.fetch().then(function(result){
            expect(result.dates).to.be.an('object');
            done();
        }).catch(function(error){
            done(error);
        });
    });
});

describe('LocalArticles API', function(){
    var endpoint = 'http://hope.api/v1';

    it('should be defined', function() {
        expect(Hope.Api.LocalArticles).to.be.a('function');
    });

    it('should set Articles Resource', function() {
        var api = Hope.Api.LocalArticles(endpoint);

        expect(api.getUrl()).to.be.equal(endpoint + '/articles.json');
    });

    it('should set category for Article Resource', function() {
        var api = Hope.Api.LocalArticles(endpoint).category('someCategory');

        expect(api.getUrl()).to.be.equal(endpoint + '/articles.json?category=someCategory');
    });

    it('should set "search" query param', function() {
        var api = Hope.Api.LocalArticles(endpoint).search('some text string');

        expect(api.getUrl()).to.be.equal(endpoint + '/articles.json?search=some+text+string');
    });
});

describe('Hope Chrono', function(){
    it('should return current time as Date instance', function(){
        var currentDate = Hope.Chrono.getDate();
        expect(currentDate).to.be.an.instanceof(Date);
    });

    it('should handle offset', function(){
        var offset = Math.ceil(Hope.Chrono.getOffset() / 1000);
        expect(offset).to.be.equal(-600);
    });
});