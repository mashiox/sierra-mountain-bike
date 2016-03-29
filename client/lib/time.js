Time = {
    day: 86400,     // seconds in a day
    hour: 3600,     // seconds in a hour
    minute: 60,     // seconds in a minute
    /**
     * Returns a string of the amount of time passed from seconds.
     */
    duration: function(diff){
        var days = Math.floor( diff/this.day );
      
        diff = ( diff - days*this.day > 0 ? diff - days*this.day : diff );
      
        var hours = Math.floor( diff/this.hour );
        diff = ( diff - hours*this.hour > 0 ? diff - hours*this.hour : diff );
        
        var minutes = Math.floor( diff/this.minute );
        diff = ( diff - minutes*this.minutes > 0 ? diff - minutes*this.minutes : diff )
        
        var seconds = diff >= 100 ? diff.toString().split("").slice(0,2).join("") : this._pad(diff, 2);
        
        return days + ":" + this._pad(hours,2) + ":" + this._pad(minutes,2) + ":" + seconds;
    },
    
    /**
     * Returns a string of the amoun of time passed from miliseconds.
     */
    durationMili: function(diff){
        return this.duration( Math.floor(diff/1000) );
    },
    
    _pad: function(n, max){
        var str = n.toString();
        return str.length < max ? this._pad("0" + str, max) : str;
    },
    
}