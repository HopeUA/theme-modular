/**
 * Global namespace for Hope Modules adn Libraries
 */
var Hope = {};

Hope.Config = {
    Api: {
        Media: {
            Endpoint: 'https://media.s.hope.ua/v1'
        },
        Scheduler: {
            Endpoint: 'https://scheduler.s.hope.ua/v1'
        },
        Thumbs: {
            Endpoint: 'https://thumb.s.hope.ua'
        },
        Articles: {
            Endpoint: 'https://tv.hope.ua/api'
        }
    },
    Site: {
        BaseURL: window.location.protocol + '://' + window.location.host
    }
};