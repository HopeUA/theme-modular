(function ($) {

    var LoaderBlock = function (object, options) {

        this.$object = $(object); // main object
        this.options = $.extend({}, LoaderBlock.DEFAULTS, options);

        this.clickCounter = 0;

        //        this.$arrowLeft = 'arrowLeft' in this.options ? $(this.options.arrowLeft) : $('.' + this.options.name + '-arrow-left');
        //        this.$arrowRight = 'arrowRight' in this.options ? $(this.options.arrowRight) : $('.' + this.options.name + '-arrow-right');

        this.$btnMore = $('.similar-episodes-btn__more');
        this.$container = $('.similar-episodes');
        this.containerHeight = this.$container.css('height');
        this.itemHeight = parseInt(this.$container.children().css('height')) + parseInt(this.$container.children().css('margin-bottom')) + 'px';
        this.textShow = this.$btnMore.data('text-show');
        this.textHide = this.$btnMore.data('text-hide');

        init(this);
    };

    LoaderBlock.DEFAULTS = {
        max: 3,
        timeUP: 400,
        tiemDown: 200
    };

    function render(self, data) {
        var strFull = self.$container.children('.similar-episodes-item').eq('0').clone();

        var src = 'img/' + data.episodeImg;
        strFull.find('.similar-episodes-item-video-image__wide').attr('src', src);
        strFull.find('.similar-episodes-item-description-time').text(moment.unix(data.episodeDate).format('DD.MM.YYYY'));
        strFull.find('.similar-episodes-item-description-title').text(data.episodeTitle);
        strFull.find('.similar-episodes-item-description-show').text(data.episodeShow);

        self.$container.append(strFull);
    }


    function loadJson(self, url) {

        $.getJSON(url, function (data) {

            var episodes = data;

            $.each(episodes, function (index, element) {
                render(self, element);
            });
        });
    };

    function init(self) {

        var counter = 0;

        self.$btnMore.click(function () {

            console.log(counter);

            if (counter == self.options.max) {

                console.log('True');
                $(this).text(self.textShow);

            } else if (counter == (self.options.max - 1)) {
                $(this).text(self.textHide);
            }

            if (counter >= self.options.max) {

                self.$container.animate({
                    'height': self.containerHeight
                }, self.options.timeUP);

                counter = 0;

                $(this).text(this.textShow);

            } else {

                if (counter <= (self.options.max - 2)) {
                    var url = 'ajax/similar-episodes' + counter + '.json';

                    loadJson(self, url);
                }

                self.$container.animate({
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
