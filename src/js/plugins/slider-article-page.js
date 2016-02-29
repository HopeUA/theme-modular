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
        this.loading = false;

        init(this);
    };

    SliderArticlePage.DEFAULTS = {
        timeArrow: 300,
        timePage: 200,
        shiftEasing : [.13,.63,.17,.99]
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

            self.loading = true;

            self.loader.single(code).fetch().then(function (data) {
                self.articleCache[code] = data;
                self.loading = false;
                console.log('inside promise');
                resolve();
            }).catch(function(error){
                console.log(error);
                self.loading = false;
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
        var easing = typeof self.options.shiftEasing === 'string' ? self.options.shiftEasing : $.bez(self.options.shiftEasing);
        var easingPrev = $.bez([.85,.01,.93,.71]);

        self.ready = false;

        if (direction == 'right') {
            self.$object.find('.page-article-header-content').animate({
                top: '+=100%'
            });
            setTimeout(function(){

                $('.page-article-text-prev').animate({
                    opacity: 1
                }, 200, easingPrev);
                $('.page-article-text-current').animate({
                    opacity: 0
                }, 450);

                self.$object.find('.page-article-text-wrap').animate({
                    marginLeft: '+=100%'
                }, self.options.timePage, easing, function() {
                    self.ready = true;
                });
            }, 150);

        } else if (direction == 'left') {
            self.$object.find('.page-article-header-content').animate({
                top: '-=100%'
            });
            setTimeout(function(){
                $('.page-article-text-next').animate({
                    opacity: 1
                }, 200, easingPrev);
                $('.page-article-text-current').animate({
                    opacity: 0
                }, 450);

                self.$object.find('.page-article-text-wrap').animate({
                    marginLeft: '-=100%'
                }, self.options.timePage, easing, function() {
                    self.ready = true;
                });
            }, 150);
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
                var wrapHeight = self.$object.find('.page-article-text-current .container').css('height');
                self.$object.find('.page-article-text-wrap').css('height', wrapHeight);
                $('.page-article-arrow__left').animate({
                    left: '5%',
                    opacity: 1
                }, 200);
                $('.page-article-arrow__right').animate({
                    right: '5%',
                    opacity: 1
                }, 200);
            });

            console.log('Next: ', nextArticleCode);
            console.log('Prev: ', prevArticleCode);
            if (nextArticleCode) {
                loadJsonByCode(self, nextArticleCode).then(function () {
                    var headerPlace = self.$object.find('.page-article-header-content-next');
                    var textPlace = self.$object.find('.page-article-text-next');
                    render(self, nextArticleCode, headerPlace, textPlace);
                    console.log('Next');
                    var poster = self.articleCache[nextArticleCode].object.image;
                    $('.page-article-header-poster-item-prev').css('background-image', 'url(' + poster + ')');
                    console.log(poster);
                });
            } else {
                self.$arrowLeft.css('display', 'none');
            }

            if (prevArticleCode) {
                loadJsonByCode(self, prevArticleCode).then(function () {
                    var headerPlace = self.$object.find('.page-article-header-content-prev');
                    var textPlace = self.$object.find('.page-article-text-prev');
                    render(self, prevArticleCode, headerPlace, textPlace);
                    console.log('Prev');
                    var poster = self.articleCache[prevArticleCode].object.image;
                    $('.page-article-header-poster-item-next').css('background-image', 'url(' + poster + ')');
                    console.log(poster);
                });
            } else {
                self.$arrowRight.css('display', 'none');
            }

        });

        self.$arrowRight.click(function (event) {
            event.preventDefault();

            if (!self.ready || self.loading) {
                return;
            }

            if (!self.articleCache[self.articleCache[self.currentCode].prev].prev) {
                hideArrow(self, self.$arrowRight);
            };

            showArrow(self, self.$arrowLeft);

            var prevCode = self.articleCache[self.currentCode].prev;

            changePage(self, 'right');
            var timer = self.options.timePage + 15;

            self.$object.find('.page-article-header-poster-item-next').css('opacity', 0);
            var visibleStatus = self.$object.find('.page-article-header-poster-item-next').css('z-index');
            console.log('visibleStatus', visibleStatus);
            if (visibleStatus == 1) {
                self.$object.find('.page-article-header-poster-item-next').css('z-index', 2);
            }
            self.$object.find('.page-article-header-poster-item-next').animate({
                opacity : 1
            }, 900, function(){
                self.$object.find('.page-article-header-poster-item-current').addClass('page-article-header-poster-item-prev').removeClass('page-article-header-poster-item-current');
                self.$object.find('.page-article-header-poster-item-next').addClass('page-article-header-poster-item-current').removeClass('page-article-header-poster-item-next');
                self.$object.find('.page-article-header-poster-item-prev').eq(0).remove();
                self.$object.find('.page-article-header-poster-item-current').after('<div class="page-article-header-poster-item-next"></div>');
            });

            setTimeout(function(){
                self.$object.find('.page-article-text-next').html('');
                self.$object.find('.page-article-text-current').addClass('page-article-text-next').removeClass('page-article-text-current');
                self.$object.find('.page-article-text-prev').addClass('page-article-text-current').removeClass('page-article-text-prev');
                self.$object.find('.page-article-text-next').eq(1).remove();
                self.$object.find('.page-article-text-current').before('<div class="page-article-text-prev"></div>');
                self.$object.find('.page-article-text-wrap').css('margin-left', '-100%');

                self.$object.find('.page-article-header-content-next').html('');
                self.$object.find('.page-article-header-content-current').addClass('page-article-header-content-next').removeClass('page-article-header-content-current');
                self.$object.find('.page-article-header-content-prev').addClass('page-article-header-content-current').removeClass('page-article-header-content-prev');
                self.$object.find('.page-article-header-content-next').eq(1).remove();
                self.$object.find('.page-article-header-content-current').before('<div class="page-article-header-content-prev"></div>');
                self.$object.find('.page-article-header-content').css('top', '-100%');
                var wrapHeight = self.$object.find('.page-article-text-current .container').css('height');
                self.$object.find('.page-article-text-wrap').animate({
                    height : wrapHeight
                }, 150);

                self.currentCode = prevCode;
                prevCode = self.articleCache[self.currentCode].prev;

                setTimeout(function(){
                    if (prevCode) {
                        loadJsonByCode(self, prevCode).then(function(){
                            var headerPlace = self.$object.find('.page-article-header-content-prev');
                            var textPlace = self.$object.find('.page-article-text-prev');
                            render(self, prevCode, headerPlace, textPlace);
                            self.$object.find('.page-article-text-wrap').css('margin-left', '-100%');
                            var nextArticle = self.articleCache[prevCode];
                            var nextImage = nextArticle.object.image;
                            var nextBackground = 'background-image: url("' + nextImage + '");';
                            var nextPlace = self.$object.find('.page-article-header-poster-item-next');
                            nextPlace.attr('style', nextBackground);
                        });
                    } else {
                        hideArrow(self, $(this));
                    }
                }, 200);

            }, 800);
        });

        self.$arrowLeft.click(function (event) {
            event.preventDefault();

            if (!self.ready || self.loading) {
                return;
            }

            if (!self.articleCache[self.articleCache[self.currentCode].next].next) {
                hideArrow(self, self.$arrowLeft);
            };
            showArrow(self, self.$arrowRight);

            var nextCode = self.articleCache[self.currentCode].next;

            changePage(self, 'left');
            var timer = self.options.timePage + 15;

            self.$object.find('.page-article-header-poster-item-next').css('opacity', 0);
            self.$object.find('.page-article-header-poster-item-prev').css('opacity', 0);
            self.$object.find('.page-article-header-poster-item-current').css('z-index', 1);
            self.$object.find('.page-article-header-poster-item-prev').animate({
                opacity : 1
            }, 900, function(){
                self.$object.find('.page-article-header-poster-item-current').addClass('page-article-header-poster-item-next').removeClass('page-article-header-poster-item-current');
                self.$object.find('.page-article-header-poster-item-prev').addClass('page-article-header-poster-item-current').removeClass('page-article-header-poster-item-prev');
                self.$object.find('.page-article-header-poster-item-next').eq(1).remove();
                self.$object.find('.page-article-header-poster-item-current').before('<div class="page-article-header-poster-item-prev"></div>');
            });

            setTimeout(function(){
                self.$object.find('.page-article-text-prev').html('');
                self.$object.find('.page-article-text-current').addClass('page-article-text-prev').removeClass('page-article-text-current');
                self.$object.find('.page-article-text-next').addClass('page-article-text-current').removeClass('page-article-text-next');
                self.$object.find('.page-article-text-prev').eq(0).remove();
                self.$object.find('.page-article-text-current').after('<div class="page-article-text-next"></div>');
                self.$object.find('.page-article-text-wrap').css('margin-left', '-100%');

                self.$object.find('.page-article-header-content-prev').html('');
                self.$object.find('.page-article-header-content-current').addClass('page-article-header-content-prev').removeClass('page-article-header-content-current');
                self.$object.find('.page-article-header-content-next').addClass('page-article-header-content-current').removeClass('page-article-header-content-next');
                self.$object.find('.page-article-header-content-prev').eq(0).remove();
                self.$object.find('.page-article-header-content-current').after('<div class="page-article-header-content-next"></div>');
                self.$object.find('.page-article-header-content').css('top', '-100%');
                var wrapHeight = self.$object.find('.page-article-text-current .container').css('height');
                self.$object.find('.page-article-text-wrap').animate({
                    height : wrapHeight
                }, 150);

                self.currentCode = nextCode;
                nextCode = self.articleCache[self.currentCode].next;

                setTimeout(function(){
                    if (nextCode) {
                        loadJsonByCode(self, nextCode).then(function(){
                            var headerPlace = self.$object.find('.page-article-header-content-next');
                            var textPlace = self.$object.find('.page-article-text-next');
                            render(self, nextCode, headerPlace, textPlace);
                            self.$object.find('.page-article-text-wrap').css('margin-left', '-100%');
                            var nextArticle = self.articleCache[nextCode];
                            var nextImage = nextArticle.object.image;
                            var nextBackground = 'background-image: url("' + nextImage + '");';
                            var nextPlace = self.$object.find('.page-article-header-poster-item-prev');
                            nextPlace.attr('style', nextBackground);
                        });
                    } else {
                        hideArrow(self, $(this));
                    }
                }, 200);

            }, 800);
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
