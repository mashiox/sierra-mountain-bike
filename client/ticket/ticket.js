Template.tickets.helpers({
    all_tickets: function() {
            return Tickets.find({}, {sort: {Date: -1}});
        
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
        event.preventDefault();
        // Find a <table> element with id="myTable":
        var table = document.getElementById("ticketTable");
        // Create an empty <tr> element and add it to the 1st position of the table:
        var row = table.insertRow();
        // Insert new cells (<td> elements) at the 1st and 2nd position of the "new" <tr> element:
        var "name" = events.target.name.value;
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        var cell4 = row.insertCell(3);
        var cell5 = row.insertCell(4);
        var cell6 = row.insertCell(5);
        var cell7 = row.insertCell(6);
        var cell8 = row.insertCell(7);
        var cell9 = row.insertCell(8);
        //Insert cell data into database
        // Tickets.insert({
        //    Name: name,
        //    Address: "Enter Address", 
        //    Phone: "Enter Phone Number",
        //    Date: "Enter Date Brought In",
        //    Problem: "Enter Problem",
        //    Cost: "Enter Estimated Cost",
        //    Status: "Enter Status",
        //    Resolution: "Enter Resolution",
        //    Description: "Enter Description",
        // });
        
        // Add some text to the new cells:
        
        cell1.innerText = "Enter Name";
        cell2.innerHTML = "Enter Address";
        cell3.innerHTML = "Enter Phone Number";
        cell4.innerHTML = "Enter Date Brought In";
        cell5.innerHTML = "Enter Problem";
        cell6.innerHTML = "Enter Estimated Cost";
        cell7.innerHTML = "Enter Status";
        cell8.innerHTML = "Enter Resolution";
        cell9.innerHTML = "Enter Description";
        // Make content editable
        row.contentEditable = true;
    }
})


Template.taskNotes.helpers({
    optionsHelper: function(){
        return {
                textarea: true,
                collection: "smbc_tickets",
                field: "Name",
                acceptEmpty: true,
                placeholder: "Enter notes",
                substitute: "Enter notes",
                removeEmpty: false
        };
    }
})