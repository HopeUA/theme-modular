$(function(){
    var $pageHome = $('.page__home');

    var contentObjects = {
        new: false,
        anons: false,
        popular: false,
        recomended: false
    };

    function blockLoader(blockName) {
        if (blockName in contentObjects) {
            contentObjects[blockName] = true;
        }

        if (contentObjects.new == true
            && contentObjects.anons == true
            && contentObjects.popular == true
            && contentObjects.recomended == true
        ) {
            animationsFunction();
        }
    }

    var animationsFunction = function() {
        $('.page__home-loader').css('display', 'none');
        $pageHome.css('height', 'auto');

        $pageHome.animate({
            opacity: 1,
            marginTop: 0
        }, 300);
    };

    window.blockLoader = blockLoader;
});