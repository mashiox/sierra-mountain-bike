SMBC.Ticket.getTickets = function(){
    return Tickets.find({}).fetch();
}

SMBC.Ticket.getOpenTickets = function(){
    return Tickets.find({CloseDate: -1}).fetch();
}

SMBC.Ticket.openTicketCount = function(){
    return this.getOpenTickets().length;
}

SMBC.Ticket.getClosedTickets = function(){
    return Tickets.find({CloseDate: {$not: -1} }).fetch();
}

SMBC.Ticket.closedTicketCount = function(){
    return this.getClosedTickets().length;
}

SMBC.Ticket.averageCloseTime = function(){
    var tickets = this.getClosedTickets();
    
    // Calculate the Date() difference of each closed ticket, and sort them.
    var closeTimeDifference = tickets.map(function(ticket){
        return Math.abs(ticket.CloseDate - ticket.Date); 
    }).sort();
    
    // Find the middle index
    // Computationally and numerically safer than any other average
    var medianIndex = ( closeTimeDifference.length % 2 === 0 ? closeTimeDifference.length/2 : (closeTimeDifference.length-1)/2 );
    return closeTimeDifference[ medianIndex ] || 0; 
}

SMBC.Ticket.repairsPerDay = function(){
    // Gets all tickets and sorts by their open time.
    var tickets = this.getTickets().sort(function(ticket1, ticket2){
        return ticket1.Date - ticket2.Date;
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
        var keyString =t.Date.getDay()+"-"+t.Date.getMonth()+"-"+t.Date.getYear();
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
    var medianIndex = ( ticketsPD.length % 2 === 0 ? ticketsPD.length/2 : (ticketsPD.length-1)/2 );
    return ticketsPD[ medianIndex ];
}

SMBC.Ticket.averageRepairPerDayConstraint = function( lowerConstraint, upperConstraint = new Date() ){
    var ticketsPD = this.repairsPerDay().filter(function( ticket ){
        // Filter the tickets to be within the defined time constraint. 
        return ticket.Date <= lowerConstraint && ( ticket.close === -1 || ticket.close <= upperConstraint ); 
    }).sort();
    
    var medianIndex = ( ticketsPD.length % 2 === 0 ? ticketsPD.length/2 : (ticketsPD.length-1)/2 );
    return ticketsPD[ medianIndex ];
}

/**
 * Returns an object of the number of ticket occurances found by problem ID
 * I.E. ( key, value ) => (problemId, # of tickets with problemId)
 */
SMBC.Ticket.problemTypeReport = function(){
    return _.countBy(this.getTickets(), function(ticket){
        return ticket.Problem;
    });
}

/**
 * Returns an object of the number of occurances of open ticket found by problem ID
 * I.E. ( key, value ) => (problemId, # of open tickets with problemId)
 */
SMBC.Ticket.openProblemTypeReport = function(){
    return _.countBy(this.getOpenTickets(), function(ticket){
        return ticket.Problem;
    });
}

SMBC.Ticket.addDefective = function(item){
    var cid;
    var smb = Customers.findOne({Name: "Sierra Mountain Bike"});
    if (!smb){
        cid = Customers.insert({
            Name: "Sierra Mountain Bike",
            Phone: "123.456.7890",
            Address: "1 Main St."
        });
    }
    else cid = smb._id;
    
    var isId;
    var issue = CommonProblems.findOne({Description: "Defective Product"});
    if ( !issue ){
        isId = CommonProblems.insert({
            Description: "Defective Product",
            Cost: 0,
            Troubleshooting: "Investigate Issue"
        })
    }
    else isId = issue._id;
    
    var notes = "Defective Count: "+item.planned+"\nItem Name: "+item.name+"\nDescription: "+item.description;
    
    Tickets.insert({
        CustomerId: cid,
        Date: new Date(),
        CloseDate: -1,
        Problem: isId,
        Status: "Open",
        Notes: notes
    });
    
}