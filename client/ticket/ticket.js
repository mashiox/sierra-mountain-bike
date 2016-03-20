Template.ticket.events({
	'click li': function (event) {
		event.preventDefault();
		$("div#displayTable").hide();
		$("div.table" + event.currentTarget.id).show();
	},

	'submit .new-search': function (event) {
		events.preventDefault();
		event.target.text.value = "";
	}
})

Template.tickets.helpers({
	all_tickets: function () {
		return {
			collection: Tickets,
			rowsPerPage: 5,
			showFilter: true,
			fields: [
                {
                    // This beautifully allows the database to be second order.
                    key: "CustomerId",
                    label: "Name",
                    fn: function(value, object, key){
                        return getCustomerName(value);
                    }
                },
                {
                    key: "Date",
                    label: "Ticked Opened",
                    fn: function(value, object, key){
                        return value.toLocaleFormat();
                    }
                },
                "Problem", "Status"
            ]
		}
	},
    
    AC_Settings: function(){
        return {
            position: "top",
            limit: 5,
            rules: [
                {
                    collection: Customers,
                    field: "Name",
                    template: Template.tickets_customerPill
                }
            ]
        };
    }
})

Template.tickets.events({
    'autocompleteselect input#name': function(event, template, doc){
        $("input#address").val(doc.Address);
        $("input#phone").val(doc.Phone);
        $("input#problem").focus();
    },
    
	'dblclick tr': function (event) {
		event.preventDefault();
		var elem = document.getElementById('editTicketDialog');
		elem.style.visibility = 'visible';
	},

	'click button#btnNewTicket': function (event) {
		event.preventDefault();
		var elem = document.getElementById('editTicketDialog');
		elem.style.visibility = 'visible';
	},

	'click button#btnCancelTicketEdit': function (event) {
		event.preventDefault();
		var elem = document.getElementById('editTicketDialog');
		elem.style.visibility = 'collapse';
	},

	'click button#export': function (event) {
		event.preventDefault();
		alert("Export Button Clicked");
	},

	'click button#newticket': function (event) {
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
		if (name == "" || address == "" || phone == "" || problem == "" || cost == "" || status == "" || resolution == "" || description == "") {
			validEntry = false;
			alert("Please fill out all fields in the table.");
		}
		//Insert cell data into database
		if (validEntry) {
            
            // TODO: Replace with Upsert
            var custData = {
                Name: name,
                Phone: phone,
                Address: address
            };
            var customer = Customers.findOne(custData);
            if (!customer){
                customer = Customers.insert(custData)
            }
			Tickets.insert({
				CustomerId: customer._id || customer,
				Date: new Date(),
                CloseDate: -1,
				Problem: problem,
				Cost: cost,
				Status: status,
				Resolution: resolution,
				Description: description,
			});

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
	}
})

Template.customers.helpers({
	all_customers: function () {
		return {
			collection: Customers,
			rowsPerPage: 5,
			showFilter: true,
			fields: ["Name", "Phone", "Address"]
		}
	}
})

Template.customers.events({
	'click button#btnNewCustomer': function (event) {
		event.preventDefault();

		var elem = document.getElementById('editCustomerDialog');
		elem.style.visibility = 'visible';
	},

	'click button#btnSaveCustomerEdit': function (event) {
		event.preventDefault();

		var name = document.getElementById('textCustomerName').value;
		var phone = document.getElementById('textCustomerPhone').value;
		var address = document.getElementById('textCustomerAddress').value;

		Customers.insert({
			Name: name,
			Phone: phone,
			Address: address,
		});
		
		document.getElementById('textCustomerName').value = "";
		document.getElementById('textCustomerPhone').value = "";
		document.getElementById('textCustomerAddress').value = "";
	},

	'click button#btnCancelCustomerEdit': function (event) {
		event.preventDefault();
		var elem = document.getElementById('editCustomerDialog');
		elem.style.visibility = 'collapse';
	}
})

Template.problems.helpers({
	all_problems: function () {
		return {
			collection: CommonProblems,
			rowsPerPage: 5,
			showFilter: true,
			fields: ["Description", "Troubleshooting"]
		}
	}
})

Template.problems.events({
	'dblclick tr': function (event) {
		event.preventDefault();
		var elem = document.getElementById('editProblemDialog');
		elem.style.visibility = 'visible';
	},

	'click button#stats': function (event) {
		event.preventDefault();
		alert("Stats Summary Clicked");
	},

	'click button#btnAddProblem': function (event) {
		event.preventDefault();
		var elem = document.getElementById('editProblemDialog');
		elem.style.visibility = 'visible';
	},

	'click button#btnSaveProblemEdit': function (event) {
		event.preventDefault();

		var title = $("input#textEditProblemTitle").val();
		var reslution = document.getElementById('textEditProblemResolution').value;

		CommonProblems.insert({
			Description: title,
			Troubleshooting: reslution
		});
	},

	'click button#btnCancelProblemEdit': function (event) {
		event.preventDefault();
		var elem = document.getElementById('editProblemDialog');
		elem.style.visibility = 'collapse';

		//Clear out data in form
		$("input#textEditProblemTitle").val("");
		document.getElementById('textEditProblemResolution').value = "";
	}
})

var getCustomerName = function(customerId){
    return Customers.findOne({_id: customerId}).Name;
}