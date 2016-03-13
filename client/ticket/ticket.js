Template.tickets.helpers({
    all_tickets: function() {
            return Tickets.find({}, {sort: {Date: -1}});
        
    },
    settings: function() {
        return {
            collection: Tickets,
            rowsPerPage: 10,
            showFilter: true,
            fields: []
        }
    }
})

Template.ticket.events({
    'click li': function(event){
        event.preventDefault();
        $("div#displayTable").hide();
        $("div.table"+event.currentTarget.id).show();
    },
    'submit .new-search': function(event) {
        events.preventDefault();
        // var "search" = event.target.search.value;

        // Clear form
      event.target.text.value = "";
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

Template.tickets.events({
    'click button#export': function(event){
        event.preventDefault();
        alert("Export Button Clicked");
    },
    
    'click button#newticket': function(event){
        // Variable to check for valid entry
        var validEntry = true;
        
        event.preventDefault();
        // Insert new cells (<td> elements) at the 1st and 2nd position of the "new" <tr> element:
        var name = $("input#name").val();
        var address = $("input#address").val();
        var phone = $("input#phone").val();
        
        var problem = $("input#problem").val();
        var cost = $("input#cost").val();
        var status = $("input#status").val();
        var resolution = $("input#resolution").val();
        var description = $("input#description").val();
        
        //checks if any fields are left empty then it wont insert into table
        if(name== ""||address== ""||phone== ""||problem== ""||cost== ""||status== ""||resolution== ""||description== ""){
            validEntry=false;
        }

        //Insert cell data into database
        if (validEntry) {
            Tickets.insert({
                Name: name,
                Address: address,
                Phone: phone,
                Date: new Date().toString(),
                Problem: problem,
                Cost: cost,
                Status: status,
                Resolution: resolution,
                Description: description,
            });
        }
         //Clear out data in form
        $("input#name").val("");
        $("input#address").val("");
        $("input#phone").val("");
        
        $("input#problem").val("");
        $("input#cost").val("");
        $("input#status").val("");
        $("input#resolution").val("");
        $("input#description").val("");
    }
})