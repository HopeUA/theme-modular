$('document').ready(function(){

    $('.header-top__social-link_rss').hover(

        function(){
            simpleAnimateTo($('.header-top__social-link_rss i:eq(1)'));
        }, function() {
            simpleAnimateFrom($('.header-top__social-link_rss i:eq(1)'));
        }
    )
});

function simpleAnimateTo(element) {
    element.animate({  borderSpacing: -90 }, {
        step: function(now,fx) {
            //alert(now);
            $(this).css('transform','rotateY('+ now +'deg)');
        },
        duration:250
    },'linear');
}

function simpleAnimateFrom(element) {
    //element.css({  border: 'solid 1px red'});
    element.animate({  borderSpacing: 0 }, {
        step: function(now,fx) {
            $(this).css('transform','rotateY('+ now +'deg)');
        },
        duration:250
    },'linear');
}
