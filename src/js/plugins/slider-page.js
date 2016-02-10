(function ($) {

    var SliderPage = function (object, options) {

        this.$object = $(object); // main object
        this.options = $.extend({}, SliderPage.DEFAULTS, options)

        if (!this.options.loader) {
            console.error('Loader required');
            return;
        }

        this.loader = this.options.loader;
        this.pageCache = {};
        this.currentCode = null;
        this.prevObject = null;
        this.$arrowLeft = 'arrowLeft' in this.options ? (this.options.arrowLeft) : $('.page-content-arrow__left');
        this.$arrowRight = 'arrowRight' in this.options ? (this.options.arrowRight) : $('.page-content-arrow__right');
        this.container = this.$object.find('.page-container-wrap');
        this.ready = true;
        this.loading = false;
        this.firstLoad = false;
        this.similarTimer = null;

        init(this);
    };

    SliderPage.DEFAULTS = {
        timeArrow: 300,
        timePage: 200,
        shiftEasing : [.13,.63,.17,.99]
    };

    function loadJsonByCode() {

        var self = [].shift.apply(arguments);
        var code = arguments[0];

        return new Promise(function(resolve) {

            if (self.pageCache.hasOwnProperty(code)) {
                resolve();
                return;
            } else {
                console.log(self.loadStatus);
                if ($('.page-episode-loader').length > 0 && self.firstLoad == false) {
                    console.log('load start');
                    $('.page-episode-loader').css('display', 'block');
                    $('.page-episode-loader').animate({
                        opacity: 1
                    }, 200);
                }
            }

            self.loading = true;
            console.log('start request');
            self.loader.code(code).fetch().then(function (data) {
                console.log('end request');
                self.pageCache[code] = data;
                self.loading = false;

                $('.page-episode-loader').animate({
                    opacity: 0
                }, 200, function () {
                    $('.page-episode-loader').css('display', 'none');
                });

                resolve();
            }).catch(function(error){
                console.log(error);
                self.loading = false;
            });

            self.firstLoad = true;
        });

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

    function changePage(self, direction) {

        var easing = typeof self.options.shiftEasing === 'string' ? self.options.shiftEasing : $.bez(self.options.shiftEasing);
        var easingPrev = $.bez([.85,.01,.93,.71]);

        if (direction == 'right') {
            $('.page-episode-prev').animate({
                opacity: 1
            }, 200, easingPrev);
            $('.page-episode-current').animate({
                opacity: 0
            }, 450);
            self.container.animate({
                marginLeft: '+=100%'
            }, self.options.timePage, easing);
        } else if (direction == 'left') {
            $('.page-episode-next').animate({
                opacity: 1
            }, 200, easingPrev);
            $('.page-episode-current').animate({
                opacity: 0
            }, 450);
            self.container.animate({
                marginLeft: '-=100%'
            }, self.options.timePage, easing);
        }
    }

    function render(self, code, place) {
        var data = self.pageCache[code];
        var renderHtml = self.options.render(data);
        place.html(renderHtml);
    }

    function init(self) {
        self.currentCode = self.$object.data('episode-code');
        loadJsonByCode(self, self.currentCode).then(function(){
            var prevEpisodeCode = self.pageCache[self.currentCode].prev;
            var nextEpisodeCode = self.pageCache[self.currentCode].next;

            var place = self.container.find('.page-episode-current');
            render(self, self.currentCode, place);
            self.$object.animate({
                marginTop: 0,
                opacity: 1
            }, 400, function() {
                self.$object.css('height', 'auto');
                self.$object.addClass('page-episode-loaded');
                $('.page-episode-arrow__left').animate({
                    left: '10%',
                    opacity: 1
                }, 200);
                $('.page-episode-arrow__right').animate({
                    right: '10%',
                    opacity: 1
                }, 200);
            });

            loadJsonByCode(self, prevEpisodeCode).then(function(){
                var place = self.container.find('.page-episode-prev');
                render(self, prevEpisodeCode, place);
            });

            loadJsonByCode(self, nextEpisodeCode).then(function(){
                var place = self.container.find('.page-episode-next');
                render(self, nextEpisodeCode, place);
            });

        });

        self.$arrowRight.click(function (event) {
            event.preventDefault();

            if (!self.ready || self.loading) {
                return;
            }

            showArrow(self, self.$arrowLeft);

            var prevCode = self.pageCache[self.currentCode].prev;

            changePage(self, 'right');
            var timer = self.options.timePage + 100;
            self.ready = false;

            setTimeout(function(){
                self.container.find('.page-episode-next').html('');
                self.container.find('.page-episode-current').addClass('page-episode-next').removeClass('page-episode-current');
                self.container.find('.page-episode-prev').addClass('page-episode-current').removeClass('page-episode-prev');
                self.container.find('.page-episode-next').eq(1).remove();
                self.container.find('.page-episode-current').before('<div class="page-episode-prev"></div>');
                self.container.css('margin-left', '-100%');

                self.currentCode = prevCode;
                prevCode = self.pageCache[self.currentCode].prev;

                if (prevCode) {
                    loadJsonByCode(self, prevCode).then(function(){
                        var place = self.container.find('.page-episode-prev');
                        render(self, prevCode, place);
                    });
                    clearTimeout(self.similarTimer);
                    console.log('event timeout');
                    self.similarTimer = setTimeout(function(){
                        console.log('event send');
                        var episodeChangedEvent = new CustomEvent('episodeChanged', {
                            detail: { code: self.currentCode }
                        });
                        document.dispatchEvent(episodeChangedEvent);
                    }, 3000);
                } else {
                    hideArrow(self, $(this));
                }

                self.ready = true;
            }, timer);
        });

        self.$arrowLeft.click(function (event) {
            event.preventDefault();

            if (!self.ready || self.loading) {
                return;
            }

            showArrow(self, self.$arrowRight);

            var nextCode = self.pageCache[self.currentCode].next;
            var prevCode = null;

            changePage(self, 'left');
            var timer = self.options.timePage + 100;
            self.ready = false;

            setTimeout(function(){
                self.currentCode = nextCode;
                nextCode = self.pageCache[self.currentCode].next;
                prevCode = self.pageCache[self.currentCode].next;

                self.container.find('.page-episode-prev').html('');
                self.container.find('.page-episode-current').addClass('page-episode-prev').removeClass('page-episode-current');
                self.container.find('.page-episode-next').addClass('page-episode-current').removeClass('page-episode-next');
                self.container.find('.page-episode-prev').eq(0).remove();
                self.container.find('.page-episode-current').after('<div class="page-episode-next"></div>');

                self.container.css('margin-left', '-100%');

                if (nextCode) {
                    loadJsonByCode(self, nextCode).then(function(){
                        var place = self.container.find('.page-episode-next');
                        render(self, nextCode, place);
                    });

                    clearTimeout(self.similarTimer);
                    self.similarTimer = setTimeout(function(){
                        var episodeChangedEvent = new CustomEvent('episodeChanged', {
                            detail: { code: self.currentCode }
                        });
                        document.dispatchEvent(episodeChangedEvent);
                    }, 3000);
                } else {
                    hideArrow(self, $(this));
                }

                self.ready = true;
            }, timer);
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
