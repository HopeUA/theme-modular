(function( $ ) {
    var SliderBlock = function(object, options){

        this.$object = $(object); // main object
        this.options = $.extend({}, SliderBlock.DEFAULTS, options);

        if (!this.options.loader) {
            console.error('Loader required1', this.options);
            return;
        }

        this.loader = this.options.loader;
        this.clickCounter = 0;

        this.$arrowLeft  = 'arrowLeft'  in this.options ? $(this.options.arrowLeft)  : $('.' + this.options.name + '-arrow-left');
        this.$arrowRight = 'arrowRight' in this.options ? $(this.options.arrowRight) : $('.' + this.options.name + '-arrow-right');

        init(this);
    };

    SliderBlock.DEFAULTS = {
        pages       : 5,
        time        : 350,
        arrowTime   : 200,
        shiftSize   : 110,
        shiftTime   : 210,
        shiftEasing : [.28,.11,.17,-0.1],
        lines       : 1
    };

    function move (self, direction) {

        var objectChildren  = self.$object.children(); // items

        if (objectChildren.length === 2) {
            var place = objectChildren.filter(':eq(1)');
            var special = true;
        } else {
             var place = self.$object;
        }

        var objectChildrenWidth = objectChildren.filter(':eq(1)').width();

        var total = Math.round(self.$object.parent().width() / objectChildrenWidth); // count blocks on screen

        var margin = parseInt(objectChildren.css('margin-right')); // column margin

        var shift  = objectChildrenWidth * total + margin * (total - 1) + margin; // width of shift block

        var easing = typeof self.options.shiftEasing === 'string' ? self.options.shiftEasing : $.bez(self.options.shiftEasing);
        // you can use string type like this 'easeInSine' or cubic-bezier like this [1,1,1,1]

        switch (direction) {
            case 'left' :

                shift += self.options.shiftSize; // add some optional animations shift
                shift += 'px'; // add 'px'

                self.clickCounter--;

                self.$object.animate({'left' : '+=' + shift}, self.options.time);

                self.$object.animate({'left' : '-=' + self.options.shiftSize + 'px'}, self.options.shiftTime, easing);

                if (self.clickCounter < (self.options.pages - 1)) {
                    self.$arrowRight.css({'display' : 'block'});
                    self.$arrowRight.animate({'opacity' : 1}, self.options.arrowTime);
                }

                if (self.clickCounter === 0) {
                    self.$arrowLeft.animate({'opacity' : 0}, self.options.arrowTime);
                    setTimeout(function(){
                        self.$arrowLeft.css({'display' : 'none'});
                    }, self.options.arrowTime)
                }

                break;

            case 'right':

                var clickLimit = total - 1; // count max clicks

                if (special) {
                    var itemsLimit = (((total - 1) * self.options.pages) * self.options.lines) + 6; // count max items
                    var n = total * 2;

                    var itemsCurrent = objectChildren.filter(':eq(1)').children().length; // count current items
                    var count = itemsLimit - itemsCurrent;

                    if (count >= n) {
                        count = n;
                    }

                } else if (self.options.lines > 1) {
                    var itemsLimit = (total * self.options.pages) * self.options.lines; // count max items
                    var n = total * 2;

                    var itemsCurrent = objectChildren.length; // count current items
                    var count = itemsLimit - itemsCurrent;

                    if (count >= n) {
                        count = n;
                    }

                } else {
                    var itemsLimit = total * self.options.pages; // count max items

                    var itemsCurrent = objectChildren.length; // count current items
                    var count = itemsLimit - itemsCurrent;

                    if (count >= total) {
                        count = total;
                    }
                }

                shift += self.options.shiftSize; // add some optional animations shift
                shift += 'px'; // add 'px'

                self.clickCounter++;

                self.$object.animate({'left' : '-=' + shift}, self.options.time);

                self.$object.animate({'left' : '+=' + self.options.shiftSize + 'px'}, self.options.shiftTime, easing);

                if (self.clickCounter > 0) {
                    self.$arrowLeft.css({'display' : 'block'});
                    self.$arrowLeft.animate({'opacity' : 1}, self.options.arrowTime);

                    if (itemsCurrent < itemsLimit) {
                        var total = self.$object.find('.content-episodes__row').children().length + 1;
                        self.loader.offset(total+1).limit(10).fetch().then(function(data) {
                            var html = self.options.render(data);
                            self.$object.find('.content-episodes__row').append(html);
                        }).catch(function(response){
                            console.error(response);
                        });
                    }
                }

                if (self.clickCounter === (self.options.pages - 1)) {
                    self.$arrowRight.animate({'opacity' : 0}, self.options.arrowTime);
                    setTimeout(function(){
                        self.$arrowRight.css({'display' : 'none'});
                    }, self.options.arrowTime);
                }

                break;

            case 'begin':

                self.clickCounter = 0;

                self.$arrowLeft.animate({'opacity' : 0}, self.options.arrowTime);

                setTimeout(function(){
                    self.$arrowLeft.css({'display' : 'none'});
                }, self.options.arrowTime)

                self.$arrowRight.css({'display' : 'block'});
                self.$arrowRight.animate({'opacity' : 1}, self.options.arrowTime);

                self.$object.animate({'left' : 0}, self.options.time);

                break;
        }
    };

    function isAnimated(self){

        return self.$object.is(':animated');

    };

    function init(self) {

        var count = 0;

        self.$arrowLeft.click(function(){

            if (isAnimated(self)) {
                return;
            }

            move(self, 'left'); // move left
        });

        self.$arrowRight.click(function(){

            if (isAnimated(self)) {
                return;
            }

            move(self, 'right'); // move right
        });

        $(window).resize(function() {
            move(self, 'begin'); // move to begin
        });

        self.loader.limit(17).fetch().then(function(data){
            var html = self.options.render(data, true);
            self.$object.html(html);


        });
    };

    SliderBlock.prototype.reload = function() {
        var self = this;
        var place = self.$object;

        self.$object.animate({opacity : 0}, 200);

        setTimeout(function(){
            self.loader.fetch().then(function(data) {
                place.append(data);
                console.log(data);
            }).catch(function(response){
                console.error(response);
            });
            self.$object.animate({opacity : 1}, 200);
        }, 200)

    };

    function Plugin(option) {
        return this.each(function () {
            var $this = $(this);
            var data = $this.data('hopeSliderBlock');
            var options = typeof option == 'object' && option; // return false or object option

            if (!data) {
                data = new SliderBlock(this, options); // constructor initializating
                $this.data('hopeSliderBlock', data);
            }

        });
    }

    $.fn.hopeSliderBlock = Plugin;
    $.fn.hopeSliderBlock.Constructor = SliderBlock;

})(jQuery);
