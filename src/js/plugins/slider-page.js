(function ($) {

    var SliderPage = function (object, options) {

        this.$object = $(object); // main object
        this.options = $.extend({}, SliderPage.DEFAULTS, options);

        this.episodeCache = {};
        this.currentCode = null;
        this.nextCode = null;
        this.nextObject = null;
        this.prevCode = null;
        this.prevObject = null;
        this.$arrowLeft = 'arrowLeft' in this.options ? (this.options.arrowLeft) : $('.page-video-content-arrow__left');
        this.$arrowRight = 'arrowRight' in this.options ? (this.options.arrowRight) : $('.page-video-content-arrow__right');
        this.template = null;

        init(this);
    };

    SliderPage.DEFAULTS = {
        url: 'ajax/',
        timeArrow: 300,
        tiemPage: 200
    };

    function loadJsonByPage(self, $object) {

        var currentJson = JSON.parse($object.html());
        self.currentCode = currentJson.episode.code;
        var currentObject = currentJson;

        self.episodeCache[self.currentCode] = currentObject;

        var next = currentObject.next;
        var prev = currentObject.prev;

        self.$arrowRight.data('code', next);
        self.$arrowLeft.data('code', prev);
    };

    function loadJsonByCode() {

        var self = [].shift.apply(arguments);

        $.each(arguments, function (index, item) {

            if (self.episodeCache.hasOwnProperty(item)) {
                return;
            }

            var url = self.options.url + item + '.json';

            $.getJSON(url, function (data) {
                self.episodeCache[item] = data;
            });

        });
    };

    function loadTemplate() {
        template = $('.page-video-wrap > .container').clone();
        template.addClass('page-video-new');
    };

    function hideArrow(self, $object) {
        $object.animate({
            'opacity': 0
        }, self.options.timeArrow, function () {
            $object.css('display', 'none');
        });
    };

    function showArrow(self, $object) {
        $object.css('display', 'block');
        $object.animate({
            'opacity': 1
        }, self.options.timeArrow);
    };

    function movePage(self, place, direction) {
        if (direction == 'left') {
            console.log('left');
            place.css('margin-left', '-100%');
            place.animate({
                'margin-left': '+=100%'
            }, self.options.tiemPage, function () {
                $('.page-video-new').removeClass('page-video-new');
                place.find('.container').eq(1).remove();
            });
        } else if (direction == 'right') {
            place.animate({
                'margin-left': '-=100%'
            }, self.options.tiemPage, function () {
                $('.page-video-new').removeClass('page-video-new');
                place.find('.container').eq(0).remove();
                place.css('margin-left', '0');
            });
        }
    };

    function renderPage(self, code, direction) {

        var place = $('.page-video-wrap');

        var currentObject = self.episodeCache[code].episode;

        template.find('.pv-episode-title').text(currentObject.title);
        $('.pv-episode-title').text(currentObject.title);
        template.find('.pv-episode-show').text(currentObject.show);
        $('.pv-episode-show').text(currentObject.show);
        var imgSrc = 'img/' + currentObject.img;
        template.find('.pv-episode-img').attr('src', imgSrc);
        template.find('.pv-episode-description').text(currentObject.description);
        template.find('.pv-episode-date').text(moment.unix(currentObject.date).format('DD.MM.YYYY'));
        template.find('.pv-episode-views').text(currentObject.views);


        if (direction == 'right') {
            place.append(template.clone());
            movePage(self, place, 'right');
        } else if (direction == 'left') {
            place.prepend(template.clone());
            movePage(self, place, 'left');
        }
    };

    function init(self) {

        loadJsonByPage(self, $('#dataCurrentJson'));
        loadJsonByCode(self, 'MBCU00215', 'MBCU00415');
        loadTemplate();

        self.$arrowRight.click(function (event) {
            event.preventDefault();

            showArrow(self, self.$arrowLeft);

            var nextCode = self.episodeCache[self.currentCode].next;

            renderPage(self, nextCode, 'right');
            self.currentCode = nextCode;

            console.log(self.episodeCache[nextCode].next);

            if (self.episodeCache[nextCode].next) {
                loadJsonByCode(self, self.episodeCache[nextCode].next);
            } else {
                hideArrow(self, $(this));
            }

        });

        self.$arrowLeft.click(function (event) {

            event.preventDefault();

            showArrow(self, self.$arrowRight);

            var nextCode = self.episodeCache[self.currentCode].prev;

            renderPage(self, nextCode, 'left');
            self.currentCode = nextCode;

            if (self.episodeCache[nextCode].prev) {
                loadJsonByCode(self, self.episodeCache[nextCode].prev);
            } else {
                hideArrow(self, $(this));
            }

        });
    };

    function Plugin(option) {
        return this.each(function () {
            var $this = $(this);
            var data = $this.data('hopeSliderPage');
            var options = typeof option == 'object' && option; // return false or object option

            if (!data) {
                data = new SliderPage(this, options); // constructor initializating
                $this.data('hopeSliderPage', data);
            }

        });
    }

    $.fn.hopeSliderPage = Plugin;
    $.fn.hopeSliderPage.Constructor = SliderPage;

})(jQuery);
