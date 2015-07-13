(function ($) {

    var LoaderBlock = function (object, options) {

        this.$object = $(object); // main object
        this.options = $.extend({}, LoaderBlock.DEFAULTS, options);

        this.$btnMore = 'btnMore' in this.options ? (this.options.btnMore) : $('.similar-episodes-btn__more');

        init(this);
    };

    LoaderBlock.DEFAULTS = {
        max: 3,
        timeUP: 400,
        tiemDown: 200
    };

    function appendBlock(self, data) {
        var template = self.$object.children('.similar-episodes-item').eq('0').clone();
        var content = self.options.render(template, data);

        self.$object.append(content);
    }

    function loadJson(self, url) {

        $.getJSON(url, function (data) {

            var episodes = data;

            $.each(episodes, function (index, element) {
                appendBlock(self, element);
            });
        });
    };

    function init(self) {

        var counter = 0;

        self.containerHeight = self.$object.css('height');
        self.itemHeight = parseInt(self.$object.children().css('height')) + parseInt(self.$object.children().css('margin-bottom')) + 'px';

        self.textShow = self.$btnMore.data('text-show');
        self.textHide = self.$btnMore.data('text-hide');

        self.$btnMore.click(function () {

            if (counter == self.options.max) {

                $(this).text(self.textShow);

            } else if (counter == (self.options.max - 1)) {
                $(this).text(self.textHide);
            }

            if (counter >= self.options.max) {

                self.$object.animate({
                    'height': self.containerHeight
                }, self.options.timeUP);

                counter = 0;

                $(this).text(this.textShow);

            } else {

                if (counter <= (self.options.max - 2)) {
                    var url = 'ajax/similar-episodes' + counter + '.json';

                    loadJson(self, url);
                }

                self.$object.animate({
                    'height': '+=' + self.itemHeight
                }, self.options.tiemDown);
                counter++;

            }
        });

        $(window).resize(function () {
            self.$container.animate({
                'height': self.containerHeight
            }, self.options.timeUP);

            counter = 0;

            self.$btnMore.text(this.textShow);
        });

    };

    function Plugin(option) {
        return this.each(function () {
            var $this = $(this);
            var data = $this.data('hopeLoaderBlock');
            var options = typeof option == 'object' && option; // return false or object option

            if (!data) {
                data = new LoaderBlock(this, options); // constructor initializating
                $this.data('hopeLoaderBlock', data);
            }

        });
    }

    $.fn.hopeLoaderBlock = Plugin;
    $.fn.hopeLoaderBlock.Constructor = LoaderBlock;

})(jQuery);
