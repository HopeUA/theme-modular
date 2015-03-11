$(function(){

    $('.new').hopeSliderBlock({
        name: 'new',
        lines: 2
    });

    var slider = $('.new').data('hopeSliderBlock');

    slider.setUrl('ajax/new');

});
