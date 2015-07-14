$(function(){

    $('.new').hopeSliderBlock({
        name: 'new',
        lines: 2
    });

    var slider = $('.new').data('hopeSliderBlock');

    if (slider) {
        slider.setUrl('ajax/new');
    }

});
