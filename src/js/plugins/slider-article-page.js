(function ($) {

    var SliderArticlePage = function (object, options) {

        this.$object = $(object); // main object
        this.options = $.extend({}, SliderArticlePage.DEFAULTS, options)

        if (!this.options.loader) {
            console.error('Loader required');
            return;
        }

        this.loader = this.options.loader;
        this.articleCache = {};
        this.currentCode = null;
        this.prevObject = null;
        this.$arrowLeft = 'arrowLeft' in this.options ? (this.options.arrowLeft) : $('.page-content-arrow__left');
        this.$arrowRight = 'arrowRight' in this.options ? (this.options.arrowRight) : $('.page-content-arrow__right');
        this.container = this.$object.find('.page-container-wrap');
        this.ready = true;

        init(this);
    };

    SliderArticlePage.DEFAULTS = {
        timeArrow: 300,
        timePage: 200
    };

    function loadJsonByCode() {

        console.log('load');
        var self = [].shift.apply(arguments);
        var code = arguments[0];

        return new Promise(function(resolve) {

            if (self.articleCache.hasOwnProperty(code)) {
                resolve();
                return;
            }

            self.loader.single(code).fetch().then(function (data) {
                self.articleCache[code] = data;
                console.log('inside promise');
                resolve();
            });
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
        self.ready = false;

        if (direction == 'right') {
            self.$object.find('.page-article-header-content').animate({
                top: '+=100%'
            });
            setTimeout(function(){
                self.$object.find('.page-article-text-wrap').animate({
                    marginLeft: '+=100%'
                }, self.options.timePage, function() {
                    self.ready = true;
                });
            }, 500);

        } else if (direction == 'left') {
            self.$object.find('.page-article-header-content').animate({
                top: '-=100%'
            });
            setTimeout(function(){
                self.$object.find('.page-article-text-wrap').animate({
                    marginLeft: '-=100%'
                }, self.options.timePage, function() {
                    self.ready = true;
                });
            }, 500);
        }
    }

    function render(self, code, header, text) {
        var data = self.articleCache[code];
        var renderHeaderHtml = self.options.render(data).header;
        var renderTextHtml = self.options.render(data).text;
        header.html(renderHeaderHtml);
        text.html(renderTextHtml);
    }

    function init(self) {
        self.currentCode = self.$object.data('article-code');

        loadJsonByCode(self, self.currentCode).then(function(){
            var prevArticleCode = self.articleCache[self.currentCode].prev;
            var nextArticleCode = self.articleCache[self.currentCode].next;

            var headerPlace = self.$object.find('.page-article-header-content-current');
            var textPlace = self.$object.find('.page-article-text-current');
            render(self, self.currentCode, headerPlace, textPlace);

            self.$object.find('.page-article-header-content').animate({
                opacity: 1,
                top: '-100%'
            });

            self.$object.find('.page-article-text-wrapper').animate({
                marginTop: 0,
                opacity: 1
            }, 400, function() {
                self.$object.css('height', 'auto');
                self.$object.addClass('page-article-loaded');
                $('.page-article-arrow__left').animate({
                    left: '10%',
                    opacity: 1
                }, 200);
                $('.page-article-arrow__right').animate({
                    right: '10%',
                    opacity: 1
                }, 200);
            });

            loadJsonByCode(self, prevArticleCode).then(function(){
                var headerPlace = self.$object.find('.page-article-header-content-prev');
                var textPlace = self.$object.find('.page-article-text-prev');
                render(self, prevArticleCode, headerPlace, textPlace);
            });

            loadJsonByCode(self, nextArticleCode).then(function(){
                var headerPlace = self.$object.find('.page-article-header-content-next');
                var textPlace = self.$object.find('.page-article-text-next');
                render(self, prevArticleCode, headerPlace, textPlace);
            });

        });

        self.$arrowRight.click(function (event) {
            event.preventDefault();

            if (!self.ready) {
                return;
            }

            showArrow(self, self.$arrowLeft);

            var prevCode = self.articleCache[self.currentCode].prev;

            changePage(self, 'right');
            var timer = self.options.timePage + 100;

            setTimeout(function(){
                self.$object.find('.page-article-text-next').html('');
                self.$object.find('.page-article-text-current').addClass('page-article-text-next').removeClass('page-article-text-current');
                self.$object.find('.page-article-text-prev').addClass('page-article-text-current').removeClass('page-article-text-prev');
                self.$object.find('.page-article-text-next').eq(1).remove();
                self.$object.find('.page-article-text-current').before('<div class="page-article-text-prev"></div>');
                self.$object.find('.page-article-text-wrap').css('margin-left', '-100%');

                //self.currentCode = prevCode;
                //prevCode = self.articleCache[self.currentCode].prev;
                //
                //if (prevCode) {
                //    loadJsonByCode(self, prevCode).then(function(){
                //        var place = self.container.find('.page-episode-prev');
                //        render(self, prevCode, place);
                //    });
                //
                //    var episodeChangedEvent = new CustomEvent('episodeChanged', {
                //        detail: { code: self.currentCode }
                //    });
                //    document.dispatchEvent(episodeChangedEvent);
                //} else {
                //    hideArrow(self, $(this));
                //}
            }, timer);
        });

        self.$arrowLeft.click(function (event) {
            event.preventDefault();

            if (!self.ready) {
                return;
            }

            showArrow(self, self.$arrowRight);

            var nextCode = self.articleCache[self.currentCode].next;
            var prevCode = null;

            changePage(self, 'left');
            //var timer = self.options.timePage + 100;
            //
            //setTimeout(function(){
            //    self.currentCode = nextCode;
            //    nextCode = self.pageCache[self.currentCode].next;
            //    prevCode = self.pageCache[self.currentCode].next;
            //
            //    self.container.find('.page-episode-prev').html('');
            //    self.container.find('.page-episode-current').addClass('page-episode-prev').removeClass('page-episode-current');
            //    self.container.find('.page-episode-next').addClass('page-episode-current').removeClass('page-episode-next');
            //    self.container.find('.page-episode-prev').eq(0).remove();
            //    self.container.find('.page-episode-current').after('<div class="page-episode-next"></div>');
            //
            //    self.container.css('margin-left', '-100%');
            //
            //    if (nextCode) {
            //        loadJsonByCode(self, nextCode).then(function(){
            //            var place = self.container.find('.page-episode-next');
            //            render(self, nextCode, place);
            //        });
            //
            //        var episodeChangedEvent = new CustomEvent('episodeChanged', {
            //            detail: { code: self.currentCode }
            //        });
            //        document.dispatchEvent(episodeChangedEvent);
            //    } else {
            //        hideArrow(self, $(this));
            //    }
            //}, timer);
        });
    };

    function Plugin(option) {
        return this.each(function () {
            var $this = $(this);
            var data = $this.data('hopeSliderArticlePage');
            var options = typeof option == 'object' && option; // return false or object option

            if (!data) {
                data = new SliderArticlePage(this, options); // constructor initializating
                $this.data('hopeSliderArticlePage', data);
            }

        });
    }

    $.fn.hopeSliderArticlePage = Plugin;
    $.fn.hopeSliderArticlePage.Constructor = SliderArticlePage;

})(jQuery);
