$(function(){

    var LocalMediaAPI = Hope.Api.LocalMedia(Hope.Config.Api.Media.Endpoint);

    $('.popular').hopeSliderBlock({
        name: 'popular',
        lines: 2,
        type: 'column',
        loader: LocalMediaAPI.shows('popular'),
        render: function (response, first) {
            first = first || false;

            var template = $('#template-popular').html();
            var view     = {};
            if (first) {
                view.first = [response.data.shift()];
            }
            view.shows = response.data;

            return Mustache.render(template, view);
        }
    });

    var slider = $('.popular').data('hopeSliderBlock');

    var counter = true;

    $('.filter-small__default').click(function(){

        event.stopPropagation();

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

    $('.filter-small__items').on('click', '.filter-small__item', function(){

        event.stopPropagation();

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

        var itemBefore = $("<li class='filter-small__item' data-type='" + filterActive.attr('data-type') + "' data-order='" + filterActive.attr('data-order') + "'>" + filterActive.html() + "</li>");

        itemBefore.appendTo(parent);
        children = parent.children().filter('li').not('.filter-small__item__selected');

        children.sort(function(a, b) {
            return a.getAttribute('data-order') > b.getAttribute('data-order');
        }).appendTo(children.parent());

        this.remove();

        parent.animate({'opacity' : 0}, 200);
        setTimeout(function(){
            parent.css({'display' : 'none'});
        }, 200);

        filterDefault.css({'display' : 'block'});
        filterDefault.animate({'opacity' : 1}, 200);

        filterDefault.html(currentText);

        filterActive.html(currentText);
        filterActive.attr('data-type', currentType);
        filterActive.attr('data-order', currentId);

        slider.reload();

        counter = !counter;
    });

    $(document).click(function(){

        $('.filter-small__default').css({'display' : 'block'});
        $('.filter-small__default').animate({'opacity' : 1}, 200);

        $('.filter-small__items').animate({'opacity' : 0}, 200);
        setTimeout(function(){
            $(this).css({'display' : 'none'});
        }, 200);

        counter = true;
    });
});
