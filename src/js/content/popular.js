$(function(){
    $('.popular').hopeSliderBlock({
        name: 'popular',
        lines: 2
    });

    var slider = $('.popular').data('hopeSliderBlock');

    slider.setUrl('ajax/popular');


    var counter = true;

    $('.filter-small__default').click(function(){

        var status = $(this).is(':animated');

        if (status) {
            return;
        }

        var items = $('.filter-small__items');

        if (counter == true) {
            $(this).animate({'opacity' : 0}, 200);
            setTimeout(function(){
                $(this).css({'display' : 'none'});
            }, 200);

            items.css({'display' : 'block'});
            items.animate({'opacity' : 1}, 200);

        } else if (counter == false) {
            items.animate({'opacity' : 0}, 200);
            setTimeout(function(){
                items.css({'display' : 'none'});
            }, 200);

            $(this).animate({'opacity' : 1}, 200);
        }

        counter = !counter;
    });

    $('.filter-small__item').click(function(){

        var status = $(this).is(':animated');

        if (status) {
            return;
        }

        var currentId   = $(this).attr('data-order');
        var currentType = $(this).attr('data-type');
        var currentText = $(this).html();

        var parent = $(this).parent();
        var children = parent.children().filter('li').not('.filter-small__item__selected');
        var childrenLength = children.length;

        var filterDefault = $(this).parents();
        filterDefault = filterDefault.children().filter('.filter-small__default');

        var filterActive = $(this).parents().children().filter('.filter-small__item__selected');

        parent.animate({'opacity' : 0}, 200);
        setTimeout(function(){
            parent.css({'display' : 'none'});
        }, 200);

        filterDefault.css({'display' : 'block'});
        filterDefault.animate({'opacity' : 1}, 200);

        filterDefault.html(currentText);
        filterActive.html(currentText);

        this.remove();

        counter = !counter;

    });
});
