$(function(){

    $('.now').hopeSliderBlock({
        name: 'now'
    });

    var slider = $('.now').data('hopeSliderBlock');

    slider.setUrl('ajax/reload');

    $('.filter-small__reload').click(function(){
        slider.reload();
    });

});