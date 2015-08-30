(function ($) {

    var LoaderBlock = function (object, options) {

        this.$object = $(object); // main object
        this.options = $.extend({}, LoaderBlock.DEFAULTS, options);

        if (!this.options.loader) {
            console.error('Loader required1', this.options);
            return;
        }

        this.loader = this.options.loader;

        this.loadStatus = true;

        this.$btnMore = 'btnMore' in this.options ? (this.options.btnMore) : $('.similar-episodes-btn__more');

        init(this);
    };

    LoaderBlock.DEFAULTS = {
        max:      3,
        timeUP:   400,
        timeDown: 200,
        limit:    {first : 15, default : 10}
    };

    function loadJson(self) {

        if (self.loadStatus) {

            var total = self.$object.children().length;

            self.loader.offset(total).limit(self.options.limit.default).fetch().then(function(data) {

                var html = self.options.render(data);
                self.$object.append(html);

            }).catch(function(response){
                console.error(response);
            });
        };
    };

    function init(self) {

        var counter = 0;

        self.textShow = self.$btnMore.data('text-show');
        self.textHide = self.$btnMore.data('text-hide');

        self.$btnMore.click(function () {

            self.itemHeight = parseInt(self.$object.children().css('height')) + parseInt(self.$object.children().css('margin-bottom')) + 'px';

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

                self.loadStatus = false;

            } else {

                if (counter <= (self.options.max - 2)) {
                    loadJson(self);
                }

                self.$object.animate({
                    'height': '+=' + self.itemHeight
                }, self.options.timeDown);
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

        self.loader.limit(self.options.limit.first).fetch().then(function(data) {

            var html = self.options.render(data);
            self.$object.html(html);
            self.containerHeight = self.$object.css('height');

        }).catch(function(response){
            console.error(response);
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
