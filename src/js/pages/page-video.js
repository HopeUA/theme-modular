$(function () {

    var counter = 0;

    $('.similar-episodes-btn__more').click(function () {

        var container = $('.similar-episodes');

        if (counter >= 2) {

            $(this).text('Скрыть');

        }

        if (counter >= 3) {

            $('.similar-episodes').animate({
                'height': '553px'
            }, 400);

            counter = 0;

            $(this).text('Показать еще');

        } else {

            if (counter <= 1) {
                var url = 'ajax/similar-episodes' + counter + '.json';

                loadJson(url);
            }

            container.animate({
                'height': '+=287px'
            }, 200);
            counter++;

        }
    });

    function loadJson(url) {

        var result = null;
        var strFull = null;


        $.getJSON(url, function (data) {

            var episodes = data;


            $.each(episodes, function (index, element) {

                strFull = '<div class="grid__column-1 similar-episodes-item">' +
                    '<div class="similar-episodes-item-video">' +
                    '<div class="similar-episodes-item-video-play"></div>' +
                    '<img src="img/' + element.episodeImg + '" class="similar-episodes-item-video-image__wide">' +

                    '</div>' +

                    '<div class="similar-episodes-item-description">' +
                    '<p class="similar-episodes-item-description-time">' + moment.unix(element.episodeDate).format('DD.MM.YYYY') + '</p>' +
                    '<p class="similar-episodes-item-description-title">' + element.episodeTitle + '111</p>' +
                    '<a href="#" class="similar-episodes-item-description-show">' + element.episodeShow + '<span> →</span></a>' +

                    '</div>' +
                    '</div>';

                $('.similar-episodes').append(strFull);

            });
        });
    };

    function timeConverter(time_unix) {
        var time = new Date(time_unix * 1000);
        var year = time.getFullYear();
        var month = time.getMonth();
        var date = time.getDate();
        var time = date + '.' + month + '.' + year;
        return time;
    }
});








$(function () {
    var episodeCashe = [];
    var currentJson = null;
    var currentCode = null;
    var currentObject = null;
    var nextCode = null;
    var nextObject = null;
    var prevCode = null;
    var prevObject = null;
    var arrowLeft = $('.page-video-content-arrow__left');
    var arrowRight = $('.page-video-content-arrow__right');

    var loadJsonByPage = function ($object) {
        currentJson = JSON.parse($object.html());
        currentCode = currentJson[0].episode.code;
        currentObject = currentJson[0];

        episodeCashe[currentCode] = currentObject;
    };

    var loadJsonByUrl = function (nextUrl, prevUrl) {
        $.when(
            $.getJSON(nextUrl), $.getJSON(prevUrl)
        ).then(function (next, prev) {
            episodeCashe[next[0][0].episode.code] = next[0][0];
            episodeCashe[prev[0][0].episode.code] = prev[0][0];
        });
    }

    var renderPage = function (data) {

        var place = $('.page-video');

        var template = '<div class="container-content">' +
                            '<div class="page-video-links">' +
                                '<a href="#">Главная</a>' +
                                '<a href="#">Программы</a>' +
                                '<a href="#">Що таке кохання</a>' +
                                '<span>Поспілкуймося</span>' +
                            '</div>' +
                        '</div>' +
                        '<div class="container-content">' +
                            '<div class="page-video-header">' +
                                '<h1 class="page-video-header-title">Що таке кохання</h1>' +
                                '<span class="page-video-header-divider"> / </span>' +
                                '<h2 class="page-video-header-show">Поспілкуймося</h2>' +
                                '<a href="#" class="page-video-header-link">О программе <span> →</span></a>' +
                            '</div>' +
                        '</div>' +

                        '<div class="video-page-content">' +
                            '<div class="video-page-content__left">' +
                                '<div class="video-page-content__left-video">' +
                                    '<div class="video-page-content__left-video-play"></div>' +
                                    '<img src="img/video-page-poster2.jpg" alt="">' +
                                '</div>' +
                                '<p class="video-page-content__left-description">Если вы знаете, что такое война, вы понимаете, что такое опасность и настоящий человеческий страх. Если вы знаете, что такое война, вы понимаете, что такое опасность и настоящий человеческий страх. Если вы знаете, что такое война, вы понимаете, что такое опасность и настоящий человеческий страх. Если вы знаете, что такое война, вы понимаете, что такое опасность и настоящий человеческий страх.</p>' +
                            '</div>' +
                            '<div class="video-page-content__right">' +
                                '<p class="video-page-content__right-time">29.10.2015</p>' +
                                '<p class="video-page-content__right-views">9835</p>' +
                                '<a href="#" class="video-page-content__right-download">Скачать</a>' +
                                '<div class="video-page-content__right-share">' +
                                    '<span class="video-page-content__right-share-title">Поделиться:</span>' +
                                    '<div class="video-page-content__right-share-items">' +
                                        '<a href="#" class="video-page-content__right-share__tw"></a>' +
                                        '<a href="#" class="video-page-content__right-share__fb"></a>' +
                                        '<a href="#" class="video-page-content__right-share__vk"></a>' +
                                    '</div>' +
                                '</div>' +
                                '<div class="video-page-content__right-likes">' +
                                    '<span class="video-page-content__right-likes-title">Мне нравится:</span>' +
                                    '<div class="video-page-content__right-likes-vk">' +
                                        '<a href="#"></a>' +
                                        '<span class="video-page-content__right-likes-vk-counter">5</span>' +
                                        '<span class="video-page-content__right-likes-vk-title">vkontakte</span>' +
                                    '</div>' +
                                    '<div class="video-page-content__right-likes-google">' +
                                        '<a href="#"></a>' +
                                        '<span class="video-page-content__right-likes-google-counter">8</span>' +
                                        '<span class="video-page-content__right-likes-google-title">google</span>' +
                                    '</div>' +
                                    '<div class="video-page-content__right-likes-fb">' +
                                        '<a href="#"></a>' +
                                        '<span class="video-page-content__right-likes-fb-counter">3</span>' +
                                        '<span class="video-page-content__right-likes-fb-title">facebook</span>' +
                                    '</div>' +
                                '</div>' +
                            '</div>' +
                        '</div>';

        $('.page-video-new').html(template);
        $('.page-video-wrap').animate({'margin-left' : '-100%'}, 300);




    };

    loadJsonByPage($('#dataCurrentJson'));
    loadJsonByUrl('ajax/MBCU00215.json', 'ajax/MBCU00415.json');


    arrowLeft.click(function () {
        console.log('left');
    });

    arrowRight.click(function () {
        renderPage(episodeCashe);
        console.log('right');
    });



});
