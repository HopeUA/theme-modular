$(function(){
    $('.recomended').hopeSliderBlock();
});


(function( $ ) {
    var SliderBlock = function(object, options){

        this.$object = $(object); // main object
        this.options = $.extend({}, SliderBlock.DEFAULTS, options);

        this.clickCounter = 0;

        this.$arrowLeft  = 'arrowLeft'  in this.options ? $(this.options.arrowLeft)  : $('.' + this.$object.attr('class') + '-arrow-left');
        this.$arrowRight = 'arrowRight' in this.options ? $(this.options.arrowRight) : $('.' + this.$object.attr('class') + '-arrow-right');

    };

    SliderBlock.DEFAULTS = {
        pages       : 5,
        time        : 350,
        arrowTime   : 200,
        shiftSize   : 150,
        shiftTime   : 450,
        shiftEasing : [.85,1.92,.63,-0.77]
    };

    SliderBlock.prototype.move = function (direction) {

        var self = this; // context for inner function scope

        var objectChildren  = this.$object.children('div'); // items

        var total = Math.round(this.$object.width() / objectChildren.width()); // count blocks on screen

        var margin = parseInt(objectChildren.css('margin-right')); // column margin
        var shift  = objectChildren.width() * total + margin * (total - 1) + margin; // width of shift block

        var easing = typeof this.options.shiftEasing === 'string' ? this.options.shiftEasing : $.bez(self.options.shiftEasing);
        // you can use string type like this 'easeInSine' or cubic-bezier like this [1,1,1,1]

        switch (direction) {
            case 'left' :

                shift -= this.options.shiftSize;   // add some optional animations shift
                shift += 'px'; // add 'px'

                this.clickCounter--;

                this.$object.animate({'left' : '+=' + shift}, self.options.time);

                setTimeout(function(){
                    self.$object.animate({'left' : '+=' + self.options.shiftSize + 'px'}, self.options.shiftTime, easing);
                }, self.options.time);

                if (this.clickCounter < (this.options.pages - 1)) {
                    this.$arrowRight.css({'display' : 'block'});
                    this.$arrowRight.animate({'opacity' : 1}, this.options.arrowTime);
                }

                if (this.clickCounter === 0) {
                    this.$arrowLeft.animate({'opacity' : 0}, this.options.arrowTime);
                    setTimeout(function(){
                        self.$arrowLeft.css({'display' : 'none'});
                    }, this.options.arrowTime)
                }

                break;

            case 'right':

                var clickLimit = total - 1; // count max clicks

                var itemsLimit   = total * this.options.pages;  // count max items
                var itemsCurrent = objectChildren.length; // count current items

                var count = itemsLimit - itemsCurrent;

                if (count >= total) {
                    count = total;
                } else {
                    count = count;
                }

                shift += this.options.shiftSize;   // add some optional animations shift
                shift += 'px'; // add 'px'

                this.clickCounter++;

                this.$object.animate({'left' : '-=' + shift}, self.options.time);

                setTimeout(function(){
                    self.$object.animate({'left' : '+=' + self.options.shiftSize + 'px'}, self.options.shiftTime, easing);
                }, self.options.time);

                if (this.clickCounter > 0) {
                    this.$arrowLeft.css({'display' : 'block'});
                    this.$arrowLeft.animate({'opacity' : 1}, this.options.arrowTime);

                    if (itemsCurrent < itemsLimit) {
                        $.get('ajax/recomended' + count + '.html',function(data){
                            self.$object.append(data);
                        });
                    }
                }

                if (this.clickCounter === (this.options.pages - 1)) {
                    this.$arrowRight.animate({'opacity' : 0}, this.options.arrowTime);
                    setTimeout(function(){
                        self.$arrowRight.css({'display' : 'none'});
                    }, this.options.arrowTime);
                }

                break;

            case 'begin':

                this.clickCounter = 0;

                this.$arrowLeft.animate({'opacity' : 0}, this.options.arrowTime);

                setTimeout(function(){
                    self.$arrowLeft.css({'display' : 'none'});
                }, this.options.arrowTime)

                this.$arrowRight.css({'display' : 'block'});
                this.$arrowRight.animate({'opacity' : 1}, this.options.arrowTime);

                this.$object.animate({'left' : 0}, this.options.time);

                break;
        }
    };

    SliderBlock.prototype.init = function() {

        var self = this; // context for inner function scope
        var count = 0;

        this.$arrowLeft.click(function(){
            self.move('left'); // move left
        });

        this.$arrowRight.click(function(){
            if (count === 0) {
                self.move('right'); // move right
                console.log('start');
                count++;
            } else {
                setTimeout(function(){
                    self.move('right'); // move right
                    console.log('interval');
                }, self.options.time);
            }
        });

        $(window).resize(function() {
            self.move('begin'); // move to begin
        });

    };

    function Plugin(option) {
        return this.each(function () {

            var options = typeof option == 'object' && option; // return false or object option

            new SliderBlock(this, options).init(); // constructor initializating

        });
    }

    $.fn.hopeSliderBlock = Plugin;
    $.fn.hopeSliderBlock.Constructor = SliderBlock;

})(jQuery);
