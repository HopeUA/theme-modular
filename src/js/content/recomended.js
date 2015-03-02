$(function(){
    $('.recomended').hopeSliderBlock();
});


(function( $ ) {
    var SliderBlock = function(object, options){
        this.$object = $(object);
        this.options = $.extend({}, SliderBlock.DEFAULTS, options);

        this.options.$arrowLeft  = $(this.selector + '-arrow-left');
        this.options.$arrowRight = $(this.selector + '-arrow-right')
        this.options.clickCounter = 0;

        init(this, this.options);
    };

    SliderBlock.DEFAULTS = {
        pages : 5
    };

    function move(object, options, direction) {
        var object_items  = $(object.selector + ' > div'); // items

        var total = Math.round(object.width() / object_items.width()); // count blocks on screen

        var margin = parseInt(object_items.css('margin-right')); // column margin
        var shift  = object_items.width() * total + margin * (total - 1) + margin; // width of shift block

        switch (direction) {
            case 'begin':
                options.clickCounter = 0;

                options.$arrowLeft.animate({'opacity' : 0}, 200);

                setTimeout(function(){
                    options.$arrowLeft.css({'display' : 'none'});
                }, 200)

                object.animate({'left' : 0}, 250);

                break;

            case 'right':
                var click_limit = total - 1; // count max clicks

                var items_limit   = total * options.pages;  // count max items
                var items_current = object_items.length; // count current items

                var count = items_limit - items_current;

                if (count >= total) {
                    count = total;
                } else {
                    count = count;
                }

                shift += 40;   // add some optional animations shift
                shift += 'px'; // add 'px'

                options.clickCounter++;

                object.animate({'left' : '+=40px'}, 300);
                object.animate({'left' : '-=' + shift, 'opacity' : '0.3'}, 250);
                object.animate({'opacity' : '1'}, 200);

                if (options.clickCounter > 0) {
                    options.$arrowLeft.css({'display' : 'block'});
                    options.$arrowLeft.animate({'opacity' : 1}, 200);

                    if (items_current < items_limit) {
                        $.get('ajax/recomended' + count + '.html',function(data){
                            object.append(data);
                        });
                        console.log('load ajax ajax/recomended' + count);
                    }
                }

                if (options.clickCounter === (options.pages - 1)) {
                    options.$arrowRight.animate({'opacity' : 0}, 200);
                    setTimeout(function(){
                        options.$arrowRight.css({'display' : 'none'});
                    }, 200);
                }

                console.log('right');
                break;

            case 'left' :
                shift -= 40;   // add some optional animations shift
                shift += 'px'; // add 'px'

                options.clickCounter--;

                object.animate({'left' : '+=40px'}, 300);
                object.animate({'left' : '+=' + shift, 'opacity' : '0.3'}, 250);
                object.animate({'opacity' : '1'}, 200);

                if (options.clickCounter < (options.pages - 1)) {
                    options.$arrowRight.css({'display' : 'block'});
                    options.$arrowRight.animate({'opacity' : 1}, 200);
                }

                if (options.clickCounter === 0) {
                    options.$arrowLeft.animate({'opacity' : 0}, 200);
                    setTimeout(function(){
                        options.$arrowLeft.css({'display' : 'none'});
                    }, 200)
                }

                console.log('left');
                break;
        }
    };

    function init(object, options) {

        options.$arrowLeft.click(function(){
            move(object, options, 'left');
        });

        options.$arrowRight.click(function(){
            move(object, options, 'right');
        });

        $(window).resize(function() {
            move(object, options, 'begin');
        });

    }

    $.fn.hopeSliderBlock = SliderBlock;

})(jQuery);
