(function( $ ) {
    var SliderBlock = function(object, options){

        this.$object = $(object); // main object
        this.options = $.extend({}, SliderBlock.DEFAULTS, options);

        if (!this.options.loader) {
            console.error('Loader required', this.options);
            return;
        }

        this.loader = this.options.loader;
        this.clickCounter = 0;
        this.readyStatus = true;

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
        lines       : 1,
        limit       : {first : 17, default : 10},
        type        : 'row'
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
                        if (self.options.type == 'column') {
                            var total = self.$object.children().length + 2;
                        } else {
                            var total = self.$object.find('.content-episodes__row').children().length + 2;
                        }

                        self.readyStatus = false;
                        self.loader.offset(total).limit(self.options.limit.default).fetch().then(function(data) {
                            var html = self.options.render(data);
                            if (self.options.type == 'column') {
                                self.$object.append(html);
                            } else {
                                self.$object.find('.content-episodes__row').append(html);
                            }
                            self.readyStatus = true; // i am ready

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
                }, self.options.arrowTime);

                if( !isMobile.any() ) {
                    self.$arrowRight.css({'display' : 'block'});
                    self.$arrowRight.animate({'opacity': 1}, self.options.arrowTime);
                }

                self.$object.animate({'left' : 0}, self.options.time);

                break;
        }
    }

    function isAnimated(self){

        return self.$object.is(':animated');

    }

    function init(self) {

        var count = 0;

        self.$arrowLeft.click(function(){

            if (isAnimated(self)) {
                return;
            }

            move(self, 'left'); // move left
        });

        self.$arrowRight.click(function(){

            if (self.readyStatus == false) {
                return;
            }

            if (isAnimated(self)) {
                return;
            }

            move(self, 'right'); // move right
        });

        $(window).resize(function() {
            move(self, 'begin'); // move to begin
        });

        self.loader.limit(self.options.limit.first).fetch().then(function(data){
            var html = self.options.render(data, true);
            self.$object.html(html);
        }).catch(function(error){
            console.log('Error in ', self.options.name);
            console.error(error);
        });
    }

    SliderBlock.prototype.reload = function() {
        var self = this;
        var place = self.$object;
        $('.filter-small__reload').addClass('filter-small__reload__loading');

        self.loader.limit(self.options.limit.first).fetch().then(function(data){
            self.$object.animate({opacity : 0}, 200, function() {
                var html = self.options.render(data, true);
                self.$object.html(html);
                self.$object.animate({opacity : 1}, 200);
                $('.filter-small__reload').removeClass('filter-small__reload__loading');
            });
        }).catch(function(response){
            console.error(response);
        });

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
