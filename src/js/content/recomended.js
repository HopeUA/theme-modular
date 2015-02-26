$(function(){

var arrow_left  = $('.recomended-arrow-left');
var arrow_right = $('.recomended-arrow-right');
var object      = $('.recomended');
var counter     = 0;
var limit       = 4;

    $('.recomended-arrow-right').click(function(){
        var total = Math.round($('.container').width() / $('.recomended .grid__column-1').width());
        var margin = parseInt($('.recomended .grid__column-1').css('margin-right'));
        var shift = $('.recomended .grid__column-1').width() * total + margin * 4 + margin;
        shift += 'px';

        counter++;

        object.animate({'left' : '-=' + shift, 'opacity' : '0.3'}, 400);
        object.animate({'opacity' : '1'}, 200);

        if (counter > 0) {
            arrow_left.css({'display' : 'block'});
            arrow_left.animate({'opacity' : 1}, 200);

            if (counter > 0 && counter < limit) {
                $.get('ajax/recomended' + total + '.html',function(data){
                    object.append(data);
                });
                console.log('load ajax');
            }
        }

        if (counter === limit) {
            arrow_right.animate({'opacity' : 0}, 200);
            arrow_right.css({'display' : 'none'});
        }

    });
});
