Template.ticket.helpers({
    
})

Template.ticket.events({
    'click li': function(event){
        event.preventDefault();
        $("div#displayTable").hide();
        $("div.table"+event.currentTarget.id).show();
    }
})

Template.problems.events({
    'click button#stats': function(event){
        event.preventDefault();
        alert("Stats Summary Clicked");
    },
    
    'click button#addProblem': function(event){
        event.preventDefault();
        alert('Add Typical Problem Clicked');
    }
})