Template.ticketStats.helpers({
    numTickets: function(){
        return SMBC.Ticket.getTickets().length;
    },
    
    numOpenTickets: function(){
        return SMBC.Ticket.openTicketCount();
    },
    
    numClosedTickets: function(){
        return SMBC.Ticket.closedTicketCount();
    },
    
    avgCloseTime: function(){
        return Time.durationMili( SMBC.Ticket.averageCloseTime() );
    },
    
    repairsPerDay: function(){
        return SMBC.Ticket.repairsPerDay();
    },
    
    avgRepairsPerDay: function(){
        return SMBC.Ticket.averageRepairsPerDay();
    },
    
    
})