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
        this.nextCode = null;
        this.nextObject = null;
        this.prevCode = null;
        this.prevObject = null;
        this.$arrowLeft = 'arrowLeft' in this.options ? (this.options.arrowLeft) : $('.page-content-arrow__left');
        this.$arrowRight = 'arrowRight' in this.options ? (this.options.arrowRight) : $('.page-content-arrow__right');
        this.template = null;

        init(this);
    };

    SliderPage.DEFAULTS = {
        timeArrow: 300,
        timePage: 200
    };

    function loadJsonByPage(self, $object) {

        var currentJson = JSON.parse($object.html());
        self.currentCode = currentJson.object.code;
        var currentObject = currentJson;

        self.pageCache[self.currentCode] = currentObject;

        var next = currentObject.next;
        var prev = currentObject.prev;

        self.$arrowRight.data('code', next);
        self.$arrowLeft.data('code', prev);
    };

    function loadJsonByCode() {

        var self = [].shift.apply(arguments);

        $.each(arguments, function (index, item) {

            if (self.pageCache.hasOwnProperty(item)) {
                return;
            }

            self.loader.code(item).fetch().then(function(data) {
                self.pageCache[item] = data;
            }).catch(function(response) {
                console.log(response);
            });

        });
    };

    function loadTemplate(self) {
        self.template = self.$object.find('.container .container').clone();
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
            place.css('margin-left', '-100%');
            place.animate({
                'margin-left': '+=100%'
            }, self.options.timePage, function () {
                place.find('.container').eq(1).remove();
            });
        } else if (direction == 'right') {
            place.animate({
                'margin-left': '-=100%'
            }, self.options.timePage, function () {
                place.find('.container').eq(0).remove();
                place.css('margin-left', '0');
            });
        }
    };

    function renderPage(self, code, direction) {

        var place = $('.page-container-wrap');

        var currentObject = self.pageCache[code].object;

        self.options.render(self.template, currentObject);

        if (direction == 'right') {
            place.append(self.template.clone());
            movePage(self, place, 'right');
        } else if (direction == 'left') {
            place.prepend(self.template.clone());
            movePage(self, place, 'left');
        }
    };

    function init(self) {

        loadJsonByPage(self, $('#dataCurrentJson'));
        loadJsonByCode(self, self.$arrowLeft.data('code'), self.$arrowRight.data('code'));
        loadTemplate(self);

        self.$arrowRight.click(function (event) {
            event.preventDefault();

            showArrow(self, self.$arrowLeft);

            var nextCode = self.pageCache[self.currentCode].next;

            renderPage(self, nextCode, 'right');
            self.currentCode = nextCode;

            if (self.pageCache[nextCode].next) {
                loadJsonByCode(self, self.pageCache[nextCode].next);
            } else {
                hideArrow(self, $(this));
            }

        });

        self.$arrowLeft.click(function (event) {

            event.preventDefault();

            showArrow(self, self.$arrowRight);

            var nextCode = self.pageCache[self.currentCode].prev;

            renderPage(self, nextCode, 'left');
            self.currentCode = nextCode;

            if (self.pageCache[nextCode].prev) {
                loadJsonByCode(self, self.pageCache[nextCode].prev);
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
