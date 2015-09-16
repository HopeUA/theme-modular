var textTrim = function (string, number, symbols) {

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

    var total = 0;
    const symbolWeight = {large: ['ю', 'ж', 'ш', 'щ', 'ф', 'м', 'ы', 'є'], small: ['ъ', 'г', 'ї', 'ґ', 'і', 'ь', '!', '1', '?', ',', '.', ':', ';', '\'', '\"']};
    const symbolWeightValues = {small: 0.3, medium: 0.5, large: 1};
    var testString = 'юъжг';
    //console.log('юъжг');
    //var arrayOfString = string.split();
    var arrayOfString = testString.split();
    //console.log('split');
    var getWeight = function (symbol) {
        //console.log('getWeight.start');
        if (typeof symbol !== 'string') {
            //console.log('!== string');
            return false;
        } else {
            symbol = symbol.toLowerCase();
            //console.log('toLowerCase');
            if (symbolWeight.large.indexOf(symbol)){
                //console.log('symbolWeightValues.large');
                return symbolWeightValues.large;
            }
            else if (symbolWeight.small.indexOf(symbol)){
                //console.log('symbolWeightValues.small');
                return symbolWeightValues.small;
            } else {
                //console.log('symbolWeightValues.medium');
                return symbolWeightValues.medium;
            }
        }
    };

    for (var i = 0; i < arrayOfString.length; i++) {
        total += getWeight(arrayOfString[i]);
        //console.log(total);
    }
    return string;
};