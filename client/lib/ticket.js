SMBC.Ticket.getTickets = function(){
    return Tickets.find({}).fetch();
}

SMBC.Ticket.getOpenTickets = function(){
    return Tickets.find({status: 0}).fetch();
}

SMBC.Ticket.openTicketCount = function(){
    return this.getOpenTickets().length;
}

SMBC.Ticket.getClosedTickets = function(){
    return Tickets.find({status: 1}).fetch();
}

SMBC.Ticket.closedTicketCount = function(){
    return this.getClosedTickets().length;
}

SMBC.Ticket.averageCloseTime = function(){
    var tickets = this.getClosedTickets();
    
    // Calculate the Date() difference of each closed ticket, and sort them.
    var closeTimeDifference = tickets.map(function(ticket){
        return Math.abs(ticket.close - ticket.open); 
    }).sort();
    
    // Find the middle index
    // Computationally and numerically safer than any other average
    var medianIndex = ( closeTimeDifference.length % 2 === 0 ? closeTimeDifference.length/2 : (closeTimeDifference.length+1)/2 );
    return closeTimeDifference[ medianIndex ]; 
}

SMBC.Ticket.repairsPerDay = function(){
    // Gets all tickets and sorts by their open time.
    var tickets = this.getTickets().sort(function(ticket1, ticket2){
        return ticket1.open - ticket2.open;
    });
    
    // Place each ticket into a buckel labeled by it's date: dd-mm-yy
    var bucket = this._toBuckets(tickets);
    
    // Determine the number of tickets per day
    var ticketCount = new Array();
    for ( var key in bucket ){
        ticketCount.push( bucket[key].length );
    }
    
    return ticketCount;
}

SMBC.Ticket._toBuckets = function(tickets){
    var bucket = [];
    tickets.forEach(function(t){
        // Make a dd-mm-yy string
        var keyString =t.open.getDay()+"-"+t.open.getMonth()+"-"+t.open.getYear();
        // if the  key doesn't exist, initialize it.
        if ( bucket[ keyString ] === undefined ){
            bucket[ keyString ] = new Array();
        }
        // if it does, just push it in.
        bucket[ keyString ].push(t);
    });
    return bucket;
}

SMBC.Ticket.averageRepairsPerDay = function(){
    var ticketsPD = this.repairsPerDay().sort();
    
    // Find the median
    var medianIndex = ( ticketsPD.length % 2 === 0 ? ticketsPD.length/2 : (ticketsPD+1)/2 );
    return ticketsPD[ medianIndex ];
}

SMBC.Ticket.averageRepairPerDayConstraint = function( lowerConstraint, upperConstraint = new Date() ){
    var ticketsPD = this.repairsPerDay().filter(function( ticket ){
        // Filter the tickets to be within the defined time constraint. 
        return ticket.open <= lowerConstraint && ( ticket.close === -1 || ticket.close <= upperConstraint ); 
    }).sort();
    
    var medianIndex = ( ticketsPD.length % 2 === 0 ? ticketsPD.length/2 : (ticketsPD+1)/2 );
    return ticketsPD[ medianIndex ];
}