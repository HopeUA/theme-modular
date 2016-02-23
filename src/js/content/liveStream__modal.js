$(function() {
    var modal = $('.liveStream-modal');
    var btnShow = $('.liveStream-show');
    var btnClose = $('.liveStream-close');

    var livecontainer = $('.liveStream-modal-video');
    var firstLoad = true;
    var player = null;

    var init = function () {
        window.liveStreamPlayerSmall.stop();

        if (firstLoad) {
            player = flowplayer(livecontainer, {
                loading: true,
                clip: {
                    live: true,
                    sources: [
                        {
                            type: "application/dash+xml",
                            src: "http://stream.hope.ua:1935/hopeua/smil:hopeua.smil/manifest.mpd"
                        },
                        {
                            type: "application/x-mpegurl",
                            src: "http://stream.hope.ua:1935/hopeua/smil:hopeua.smil/playlist.m3u8"
                        }
                    ]
                }
            }).on("error", function (e, api, err) {
                if (err.code == 5) {

                }
            });

            player.on('load ready', function () {
                player.play();
                player.volume(1);
            });

            player.on('fullscreen', function() {
                livecontainer.addClass('liveStream-modal-video-expanded');
            });

            player.on('fullscreen-exit', function() {
                livecontainer.removeClass('liveStream-modal-video-expanded');
            });

            firstLoad = false;
        } else {
            player.play();
            player.volume(1);
        }
    };

    btnShow.click(function () {
        init();
        modal.css('display', 'block');
    });

    btnClose.click(function () {
        modal.css('display', 'none');
        player.stop();
        window.liveStreamPlayerSmall.play();
    });

    $(window).click(function (event) {
        if ($(event.target).hasClass('liveStream-modal')) {
            modal.css('display', 'none');
            player.stop();
            window.liveStreamPlayerSmall.play();
        }
    });
});