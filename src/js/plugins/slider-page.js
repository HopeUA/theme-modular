(function ($) {

    var SliderPage = function (object, options) {

        this.$object = $(object); // main object
        this.options = $.extend({}, SliderPage.DEFAULTS, options);

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
        this.player = null;
        this.playerReady = false;

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

                if ($('.page-episode-loader').length > 0 && self.firstLoad == false) {
                    console.log('load start');
                    $('.page-episode-loader').css('display', 'block');
                    $('.page-episode-loader').animate({
                        opacity: 1
                    }, 200);
                }
            }

            self.loading = true;

            self.loader.code(code).fetch().then(function (data) {

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
            }, self.options.timePage, easing, function() {
                //setVideo(self);
            });
        } else if (direction == 'left') {
            $('.page-episode-next').animate({
                opacity: 1
            }, 200, easingPrev);
            $('.page-episode-current').animate({
                opacity: 0
            }, 450);
            self.container.animate({
                marginLeft: '-=100%'
            }, self.options.timePage, easing, function() {
                //setVideo(self);
            });
        }
    }

    function render(self, code, place) {
        var data = self.pageCache[code];
        var renderHtml = self.options.render(data);
        place.html(renderHtml);
    }

    var loadCounter = 0;
    function onPageLoad(self) {
        loadCounter++;
        if (loadCounter == 2) {
            setVideo(self);
        }
    }

    function setVideo(self) {
        $('#youtubePlayer').remove();
        $('.page-episode-current .page-episode-content-video').append('<div class="pv-episode-videoPlayer" id="youtubePlayer"></div>');

        $('.page-episode-content-video-play').css({
            display: 'block',
            opacity: 1
        });
        $('.pv-episode-img').css({
            display: 'block',
            opacity: 1
        });
        var videoWidth = $('.pv-episode-img').width();
        var videoHeight = $('.pv-episode-img').height();
        self.player = new YT.Player('youtubePlayer', {
            height: videoHeight,
            width: videoWidth,
            videoId: self.pageCache[self.currentCode].source.youtube.id,
            events: {
                onReady: function() {
                    self.playerReady = true;
                }
            }
        });
    }

    function waitPlayer(self) {
        return new Promise(function(resolve, reject){
            var counter = 0;
            var interval = setInterval(function(){
                counter++;
                if (counter > 200) {
                    clearInterval(interval);
                    return reject();
                }

                if (self.playerReady) {
                    clearInterval(interval);
                    return resolve();
                }
            }, 10);
        });
    }

    function init(self) {
        self.currentCode = self.$object.data('episode-code');

        // Video from Youtube

        var status = false;

        var tag = document.createElement('script');

        tag.src = "http://www.youtube.com/iframe_api";
        var firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

        // 3. This function creates an <iframe> (and YouTube player)
        //    after the API code downloads.
        window.onYouTubeIframeAPIReady = function() {
            onPageLoad(self);
        };

        $('.page-container-wrap').on('click', '.page-episode-content-video', function() {
            console.log('click');

            waitPlayer(self).then(function(){

                $('.page-episode-current .page-episode-content-video-play').animate({
                    opacity: 0
                }, 400, function() {
                    $('.page-episode-current .page-episode-content-video-play').css('display', 'none');
                });

                setTimeout(function(){
                    $('.page-episode-current .pv-episode-img').animate({
                        opacity: 0
                    }, 400, function() {
                        $('.page-episode-current .pv-episode-img').css('display', 'none');
                    });
                }, 300);

                self.player.playVideo();
            }).catch(function(){
                console.error('Youtube player error');
            });
        });

        // END videoPlayer

        loadJsonByCode(self, self.currentCode).then(function(){
            var prevEpisodeCode = self.pageCache[self.currentCode].links.prev;
            var nextEpisodeCode = self.pageCache[self.currentCode].links.next;

            var place = self.container.find('.page-episode-current');
            render(self, self.currentCode, place);
            onPageLoad(self);

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

            self.playerReady = false;

            showArrow(self, self.$arrowLeft);

            var prevCode = self.pageCache[self.currentCode].links.prev;

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
                prevCode = self.pageCache[self.currentCode].links.prev;

                setVideo(self);

                if (prevCode) {
                    loadJsonByCode(self, prevCode).then(function(){
                        var place = self.container.find('.page-episode-prev');
                        render(self, prevCode, place);
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

        self.$arrowLeft.click(function (event) {
            event.preventDefault();

            if (!self.ready || self.loading) {
                return;
            }

            self.playerReady = false;

            showArrow(self, self.$arrowRight);

            var nextCode = self.pageCache[self.currentCode].links.next;
            var prevCode = null;

            changePage(self, 'left');
            var timer = self.options.timePage + 100;
            self.ready = false;

            setTimeout(function(){
                self.currentCode = nextCode;
                nextCode = self.pageCache[self.currentCode].links.next;
                prevCode = self.pageCache[self.currentCode].links.prev;

                self.container.find('.page-episode-prev').html('');
                self.container.find('.page-episode-current').addClass('page-episode-prev').removeClass('page-episode-current');
                self.container.find('.page-episode-next').addClass('page-episode-current').removeClass('page-episode-next');
                self.container.find('.page-episode-prev').eq(0).remove();
                self.container.find('.page-episode-current').after('<div class="page-episode-next"></div>');

                self.container.css('margin-left', '-100%');

                setVideo(self);

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
