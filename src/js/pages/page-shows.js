$(function () {
    var page = $('.page-shows');
    if (page.length == 0) {
        return;
    }

    $('.page-programs-content-items article').click(function(){
        location.href = $(this).find('a').attr('href');
    });
    
    $('.content-shows__row-container').on('click', '.content-shows__row-item-card', function(){
        location.href = $(this).find('a').attr('href');
    });
});
