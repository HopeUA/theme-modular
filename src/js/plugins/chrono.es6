(function(Hope){
    class Chrono {
        constructor() {
            this.offset = (moment.tz('Europe/Kiev').format('H') - moment().format('H')) * 60 * 60 * 1000;
        }

        getDate() {
            return moment(new Date(Date.now() + this.offset));
        }

        getOffset() {
            return this.offset;
        }
    }

    Hope.Chrono = new Chrono();
})(Hope);