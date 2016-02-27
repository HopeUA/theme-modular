$(function(){
   $('.header-top__social-item').click(function(){
       var linkUrk = $(this).find('a').attr('href');
       if (linkUrk) {
           window.location.href = linkUrk;
       }
   });
});

$(function(){
    var $pageHome = $('.page__home');

    if ($pageHome.length == 0) {
        return;
    }

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

    // live stream

    var livecontainer = $("#dashlive");
    var $playerMuteButton = $('.content-sheduler__vertical-current-image .videoMuteButton');
    var $playerPlayButton = $('.content-sheduler__vertical-current-image .videoPlayButton');
    var $playerExpandButton = $('.content-sheduler__vertical-current-image .videoExpandButton');
    var muteStatus = true;
    var playStatus = true;
    var player = flowplayer(livecontainer, {
        loading: true,
        clip: {
            live: true,
            sources: [
                { type: "application/dash+xml",
                    src:  "https://stream.hope.ua/hopeua/smil:hopeua.smil/manifest.mpd" },
                { type: "application/x-mpegurl",
                    src:  "https://stream.hope.ua/hopeua/smil:hopeua.smil/playlist.m3u8" }
            ]
        }
    }).on("error", function (e, api, err) {
        if (err.code == 5) {

        }
    });

    window.liveStreamPlayerSmall = player;

    player.on('load ready', function() {
        player.play();
        player.volume(0);
    });

    player.on('pause', function() {
       if (livecontainer.hasClass('dashlive-expanded')) {
           // show play button
       }
    });

    player.on('fullscreen-exit', function() {
        livecontainer.removeClass('dashlive-expanded');
        livecontainer.addClass('dashlive-small');
        player.volume(0);
        player.play();
        $playerPlayButton.removeClass('videoPlayButtonFalse').addClass('videoPlayButtonTrue');
        $playerMuteButton.removeClass('videoMuteButtonTrue').addClass('videoMuteButtonFalse');
        muteStatus = true;
    });

    $playerMuteButton.click(function() {
        if (muteStatus) {
            player.volume(1);
            $playerMuteButton.removeClass('videoMuteButtonFalse').addClass('videoMuteButtonTrue');
            muteStatus = false;
        } else {
            player.volume(0);
            $playerMuteButton.removeClass('videoMuteButtonTrue').addClass('videoMuteButtonFalse');
            muteStatus = true;
        }
    });

    $playerExpandButton.click(function() {
        player.play();
        player.fullscreen();
        player.volume(1);
        $playerMuteButton.removeClass('videoMuteButtonFalse').addClass('videoMuteButtonTrue');
        livecontainer.removeClass('dashlive-small');
        livecontainer.addClass('dashlive-expanded');
    });

    $playerPlayButton.click(function() {
        if (playStatus) {
            player.pause();
            playStatus = false;
            $playerPlayButton.removeClass('videoPlayButtonTrue').addClass('videoPlayButtonFalse');
            console.log('player on paused');
        } else {
            player.resume();
            playStatus = true;
            $playerPlayButton.removeClass('videoPlayButtonFalse').addClass('videoPlayButtonTrue');
            console.log('player on play');
        }
    });
});