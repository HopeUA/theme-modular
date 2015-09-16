var text_trim = function (string, number, symbols) {

    var reg = /[а-яёіїА-Яa-zA-Z]/;

    string.description = $('<p>' + string.description + '</p>').text();
    string.title = $('<p>' + string.title + '</p>').text();

    if (string.length > number) {

        string = string.substring(0, number).trim();

        for(var i = string.length - 1; i > 0; i--) {
            var currentTitle = string.charAt(i);
            if (reg.test(currentTitle)) {
                break;
            } else {
                string = string.substring(0, string.length - 1);
            }
        }

        if(typeof symbols !== 'undefined') {
            string += symbols;
        } else{
            string += '...';
        }

    }

    return string;
};