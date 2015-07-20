$(function () {

    $('.page-sheduler-content-item').click(function () {
        var current = $('.page-sheduler-content-items .active');

        current.animate({
            height: 45,
            borderWidth: 0
        }, function () {
            current.animate({
                height: 45
            }, 200)
        });

        //current.removeClass('active');

        showItem($(this));

    });

    function showItem($item) {
        $item.css({
            backgroundColor: '#fff'
        });

        $item.find('*').css({
            opacity: 0
        });

        $item.animate({
            height: 300
        }, 150, function () {
            $item.find('*').animate({
                opacity: 1
            });
        });

        $item.addClass('active');
    }

});
