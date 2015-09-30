(function(Hope){
    class Chrono {
        constructor(channelTime) {
            this.offset = channelTime.getTime() - Date.now();
        }

        getDate() {
            return new Date(Date.now() + this.offset);
        }

        getOffset() {
            return this.offset;
        }
    }

    //Hope.Chrono = new Chrono(HopeUATime);
})(Hope);