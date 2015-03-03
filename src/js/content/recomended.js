$(function(){
    $('.recomended').hopeSliderBlock();
});


(function( $ ) {
    var SliderBlock = function(object, options){

        this.$object = $(object);
        this.options = $.extend({}, SliderBlock.DEFAULTS, options);

        this.clickCounter = 0;

        this.$arrowLeft  = 'arrowLeft'  in this.options ? $(this.options.arrowLeft)  : $('.' + this.$object.attr('class') + '-arrow-left');
        this.$arrowRight = 'arrowRight' in this.options ? $(this.options.arrowRight) : $('.' + this.$object.attr('class') + '-arrow-right');

        console.log(this.$arrowLeft);
        console.log(this.$arrowRight);

    };

    SliderBlock.DEFAULTS = {
        pages     : 5
    };

    SliderBlock.prototype.move = function (direction) {

        var self = this;

        console.log('call move');

        var object_items  = this.$object.children('div');

        var total = Math.round(this.$object.width() / object_items.width()); // count blocks on screen

        var margin = parseInt(object_items.css('margin-right')); // column margin
        var shift  = object_items.width() * total + margin * (total - 1) + margin; // width of shift block

        switch (direction) {
            case 'begin':
                this.clickCounter = 0;

                this.$arrowLeft.animate({'opacity' : 0}, 200);

                setTimeout(function(){
                    this.$arrowLeft.css({'display' : 'none'});
                }, 200)

                this.$object.animate({'left' : 0}, 250);

                break;

            case 'right':
                var click_limit = total - 1; // count max clicks

                var items_limit   = total * this.options.pages;  // count max items
                var items_current = object_items.length; // count current items

                var count = items_limit - items_current;

                if (count >= total) {
                    count = total;
                } else {
                    count = count;
                }

                shift += 150;   // add some optional animations shift
                shift += 'px'; // add 'px'

                this.clickCounter++;

                this.$object.animate({'left' : '-=' + shift}, 250);
                setTimeout(function(){
                    self.$object.animate({'left' : '+=150px'}, 450, $.bez([.85,1.92,.63,-0.77]));
                }, 250);


                if (this.clickCounter > 0) {
                    this.$arrowLeft.css({'display' : 'block'});
                    this.$arrowLeft.animate({'opacity' : 1}, 200);

                    if (items_current < items_limit) {
                        $.get('ajax/recomended' + count + '.html',function(data){
                            self.$object.append(data);
                        });
                        console.log('load ajax ajax/recomended' + count);
                    }
                }

                if (this.clickCounter === (this.options.pages - 1)) {
                    this.$arrowRight.animate({'opacity' : 0}, 200);
                    setTimeout(function(){
                        this.$arrowRight.css({'display' : 'none'});
                    }, 200);
                }

                console.log('right');
                break;

            case 'left' :
                shift -= 40;   // add some optional animations shift
                shift += 'px'; // add 'px'

                this.clickCounter--;

                this.$object.animate({'left' : '+=40px'}, 300);
                this.$object.animate({'left' : '+=' + shift, 'opacity' : '0.3'}, 250);
                this.$object.animate({'opacity' : '1'}, 200);

                if (this.clickCounter < (this.options.pages - 1)) {
                    this.$arrowRight.css({'display' : 'block'});
                    this.$arrowRight.animate({'opacity' : 1}, 200);
                }

                if (this.clickCounter === 0) {
                    this.$arrowLeft.animate({'opacity' : 0}, 200);
                    setTimeout(function(){
                        this.$arrowLeft.css({'display' : 'none'});
                    }, 200)
                }

                console.log('left');
                break;
        }
    };

    SliderBlock.prototype.init = function() {

        console.log('init');
        var self = this;
        this.$arrowLeft.click(function(){
            console.log('left');
            self.move('left');
        });

        this.$arrowRight.click(function(){
            self.move('right');
        });

        $(window).resize(function() {
            self.move('begin');
        });

    };



    function Plugin(option) {
        return this.each(function () {
            var options = typeof option == 'object' && option;

            new SliderBlock(this, options).init();
        });
    }

    $.fn.hopeSliderBlock = Plugin;
    $.fn.hopeSliderBlock.Constructor = SliderBlock;

})(jQuery);
