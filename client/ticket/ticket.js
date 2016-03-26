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
                        return Customers.findOne({_id: value}).Name;
                    }
                },
                {
                    key: "Date",
                    label: "Ticked Opened",
                    fn: function(value, object, key){
                        return value.toLocaleFormat();
                    }
                },
                {
                    key: "Problem",
                    label: "Problem",
                    fn: function(value, object, key){
                        return CommonProblems.findOne({_id: value}).Description;
                    }
                },
                {
                    key: "CloseDate",
                    label: "Status",
                    fn: function(value, object, key){
                        return value === -1 ? "Open" : "Closed";
                    }
                },
				{ key: 'options', label: 'Options', tmpl: Template.ticketOptionsColumn }
            ]
		}
	},
	
	All_Customers: function () {
		return Customers.find();
	},

	All_Common_Problem: function(){
		return CommonProblems.find();
	},
    
    AC_Settings_Customers: function(){
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
    },
    
    AC_Settings_Problems: function(){
        return {
            position: "top",
            limit: 5,
            rules: [
                {
                    collection: CommonProblems,
                    field: "Description",
                    template: Template.tickets_problemsPill
                }
            ]
        };
    }
})

Template.tickets.events({
    'autocompleteselect input#problem': function(event, template, doc){
        Session.set("problemId", doc._id);
        $("input#resolution").val(doc.Troubleshooting);
        $("input#cost").val(doc.Cost);
    },
    
    'autocompleteselect input#name': function(event, template, doc){
        Session.set("customerId", doc._id);
        $("input#address").val(doc.Address);
        $("input#phone").val(doc.Phone);
        $("input#problem").focus();
    },

    'click button#btnEditTicket': function (event) {
    	event.preventDefault();

    	var customer = document.getElementById('selectTicketCustomer');
    	customer.value = Customers.findOne({ _id: this.CustomerId }).Name;
    	
    	var problem = document.getElementById('selectTicketProblem');
    	problem.value = CommonProblems.findOne({ _id: this.Problem }).Description;

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
        var data = Tickets.find({}).fetch();
        var csv = Papa.unparse(data);     
        window.open('data:application/csv;charset=utf-8,' + csv);
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
            
            var problemData = {
                /* Cost not included, so that querying problems is indep of cost*/
                Description: problem,
                Troubleshooting: resolution
            }
            var problemD = CommonProblems.findOne(problemData);
            if (!problemD){
                problemData.Cost = cost; // if it dne, then make it the suggested cost.
                problemD = CommonProblems.insert(problemData);
            }
            
			Tickets.insert({
				CustomerId: customer._id || customer,
				Date: new Date(),
                CloseDate: -1,
				Problem: problemD._id || problemD,
				Cost: cost,
				Status: status,
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
			fields: ["Name", "Phone", "Address",
			{ key: 'options', label: 'Options', tmpl: Template.customerOptionsColumn }]
		}
	}
})

Template.customers.events({
	'click button#btnEditCustomer': function (event) {
		event.preventDefault();

		document.getElementById('textCustomerName').value = this.Name;
		document.getElementById('textCustomerPhone').value = this.Phone;
		document.getElementById('textCustomerAddress').value = this.Address;

		var elem = document.getElementById('editCustomerDialog');
		elem.style.visibility = 'visible';
	},

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
			fields: ["Description", "Troubleshooting", "Cost",
                {
                    key: "_id",
                    label: 'Count',
                    fn: function(value, obj, key){
                        return SMBC.Ticket.getTickets().filter(function(ticket){
                            return ticket.Problem === value;
                        }).length;
                    }
                },
				{ key: 'options', label: 'Options', tmpl: Template.problemOptionsColumn }
            ]
		}
	}
})

Template.problems.events({
	'click button#btnEditProblem': function (event) {
		event.preventDefault();

		var obj = this; // need to store this reference to process the update operation

		bootbox.dialog({
			title: "Update problem...",
			onEscape: true,
			backdrop: true,
			message: renderTmp(Template.dialogEditProblem),
			buttons: {
				success: {
					label: "Update",
					className: "btn-success",
					callback: function () {
						var title = $('#txtNewProblemTitle').val().trim();
						var cost = $('#txtNewProblemCost').val().trim();
						var troubleshooting = $('#txtNewProblemTroubleshooting').val().trim();

						if (title == '' || cost == '' || troubleshooting == '') {
							swal('Oops...', 'All fields must be filled out!', 'error');
							return false;
						}

						if (title == obj.Description && cost == obj.Cost && troubleshooting == obj.Troubleshooting) {
							swal('Oops...', 'No fields were changed', 'warning');
							return false;
						}

						var match = CommonProblems.findOne({ Description: new RegExp('^' + title + '$', "i") })
						if (match && match._id != obj._id) {
							swal('Oops...', 'That problem already exists!', 'error');
							return false;
						}

						CommonProblems.update({ _id: obj._id }, { $set: { Description: title, Cost: cost, Troubleshooting: troubleshooting } });

						swal('Success!', 'Problem updated!', 'success');
						return true;
					}
				}
			}
		});

		document.getElementById('txtNewProblemTitle').value = this.Description;
		document.getElementById('txtNewProblemCost').value = this.Cost;
		document.getElementById('txtNewProblemTroubleshooting').value = this.Troubleshooting;
	},

	'click button#btnAddProblem': function (event) {
		event.preventDefault();

		bootbox.dialog({
			title: "Create new problem...",
			onEscape: true,
			backdrop: true,
			message: renderTmp(Template.dialogEditProblem),
			buttons: {
				success: {
					label: "Create",
					className: "btn-success",
					callback: function () {
						var title = $('#txtNewProblemTitle').val().trim();
						var cost = $('#txtNewProblemCost').val().trim();
						var troubleshooting = $('#txtNewProblemTroubleshooting').val().trim();

						if (title == '' || cost == '' || troubleshooting == '')
						{
							swal('Oops...', 'All fields must be filled out!', 'error');
							return false;
						}

						var match = CommonProblems.findOne({ Description: new RegExp('^' + title + '$', "i")});
						if (match)
						{
							swal('Oops...', 'That problem already exists!', 'error');
							return false;
						}

						CommonProblems.insert({
							Description: title,
							Cost: cost,
							Troubleshooting: troubleshooting
						});

						swal('Success!', 'Problem added!', 'success');
						return true;
					}
				}
			}
		});
	},

	'click button#stats': function (event) {
		event.preventDefault();
		alert("Stats Summary Clicked");
	}
})

var renderTmp = function (template, data) {
	var node = document.createElement("div");
	document.body.appendChild(node);
	UI.renderWithData(template, data, node);
	return node;
}
