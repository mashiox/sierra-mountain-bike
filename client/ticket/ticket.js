Template.ticket.events({
    'click li': function (event) {
		paginationClickHelper(event);
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
                        return object.Date.toLocaleFormat();
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
	}
})

Template.tickets.events({
    'click button#btnEditTicket': function (event) {
    	event.preventDefault();

    	var obj = this; // need to store this reference to process the update operation

    	bootbox.dialog({
    		title: "Update ticket...",
    		onEscape: true,
    		backdrop: true,
    		message: renderTmp(Template.dialogEditTicket),
    		buttons: {
    			success: {
    				label: "Update",
    				className: "btn-success",
    				callback: function () {
    					var customerID = $('#selectEditTicketCustomer').val();
    					var problemID = $('#selectEditTicketProblem').val();
    					var notes = $("#txtEditTicketNotes").val();
    					var status = $("#selectEditTicketStatus").val();

    					var customer = Customers.findOne({ _id: customerID });
    					if (customer == null) {
    						swal('Oops...', 'Select a customer!', 'error');
    						return false;
    					}

    					if (customerID == obj.CustomerId && problemID == obj.Problem && notes == obj.Notes && status == obj.Status) {
    						swal('Oops...', 'No fields were changed', 'warning');
    						return false;
    					}

    					var problem = CommonProblems.findOne({ _id: problemID });
    					if (problem == null) {
    						swal('Oops...', 'Select a problem!', 'error');
    						return false;
    					}

    					Tickets.update({ _id: obj._id }, { $set: { CustomerId: customer._id || customer, Problem: problem._id || problem, Status: status, Notes: notes } });

    					if (status != obj.Status && status === "Closed") {
    						Tickets.update({ _id: obj._id }, { $set: { CloseDate: new Date() } });
    					}

    					swal('Success!', 'Ticket updated!', 'success');
    					return true;
    				}
    			}
    		}
    	});

    	document.getElementById('selectEditTicketCustomer').value = this.CustomerId;
    	document.getElementById('selectEditTicketProblem').value = this.Problem;
    	document.getElementById('txtEditTicketNotes').value = this.Notes;
    	document.getElementById('selectEditTicketStatus').value = this.Status;
    },

	'click button#btnAddTicket': function (event) {
		event.preventDefault();

		bootbox.dialog({
			title: "Create new ticket...",
			onEscape: true,
			backdrop: true,
			message: renderTmp(Template.dialogEditTicket),
			buttons: {
				success: {
					label: "Create",
					className: "btn-success",
					callback: function () {
						var customerID = $('#selectEditTicketCustomer').val();
						var problemID = $('#selectEditTicketProblem').val();
						var notes = $("#txtEditTicketNotes").val();
						var status = $("#selectEditTicketStatus").val();

						var customer = Customers.findOne({ _id: customerID });
						if (customer == null) {
							swal('Oops...', 'Select a customer!', 'error');
							return false;
						}

						var problem = CommonProblems.findOne({ _id: problemID });
						if (problem == null) {
							swal('Oops...', 'Select a problem!', 'error');
							return false;
						}

						Tickets.insert({
							CustomerId: customer._id || customer,
							Date: new Date(),
							CloseDate: -1,
							Problem: problem._id || problem,
							Status: status,
							Notes: notes
						});

						swal('Success!', 'Ticket added!', 'success');
						return true;
					}
				}
			}
		});

		document.getElementById("selectEditTicketStatus").disabled = true;
	},

	'click button#export': function (event) {
		event.preventDefault();
        var data = Tickets.find({}).fetch();
        var csv = Papa.unparse(data);     
        window.open('data:application/csv;charset=utf-8,' + csv);
	}
})

Template.dialogEditTicket.helpers({
	All_Customers: function () {
		return Customers.find();
	},

	All_Common_Problem: function(){
		return CommonProblems.find();
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

		var obj = this; // need to store this reference to process the update operation

		bootbox.dialog({
			title: "Update customer...",
			onEscape: true,
			backdrop: true,
			message: renderTmp(Template.dialogEditCustomer),
			buttons: {
				success: {
					label: "Update",
					className: "btn-success",
					callback: function () {
						var name = $('#txtEditCustomerName').val().trim();
						var phone = $('#txtEditCustomerPhone').val().trim();
						var address = $('#txtEditCustomerAddress').val().trim();

						if (name == '' || phone == '' || address == '') {
							swal('Oops...', 'All fields must be filled out!', 'error');
							return false;
						}

						if (name == obj.Name && phone == obj.Phone && address == obj.Address) {
							swal('Oops...', 'No fields were changed', 'warning');
							return false;
						}

						var match = Customers.findOne({ Name: new RegExp('^' + name + '$', "i") })
						if (match && match._id != obj._id) {
							swal('Oops...', 'That customer already exists!', 'error');
							return false;
						}

						Customers.update({ _id: obj._id }, { $set: { Name: name, Phone: phone, Address: address } });

						swal('Success!', 'Customer updated!', 'success');
						return true;
					}
				}
			}
		});

		document.getElementById('txtEditCustomerName').value = this.Name;
		document.getElementById('txtEditCustomerPhone').value = this.Phone;
		document.getElementById('txtEditCustomerAddress').value = this.Address;
	},

	'click button#btnAddCustomer': function (event) {
		event.preventDefault();

		bootbox.dialog({
			title: "Create new customer...",
			onEscape: true,
			backdrop: true,
			message: renderTmp(Template.dialogEditCustomer),
			buttons: {
				success: {
					label: "Create",
					className: "btn-success",
					callback: function () {
						var name = $('#txtEditCustomerName').val().trim();
						var phone = $('#txtEditCustomerPhone').val().trim();
						var address = $('#txtEditCustomerAddress').val().trim();

						if (name == '' || phone == '' || address == '') {
							swal('Oops...', 'All fields must be filled out!', 'error');
							return false;
						}

						var match = Customers.findOne({ Name: new RegExp('^' + name + '$', "i") });
						if (match) {
							swal('Oops...', 'That customer already exists!', 'error');
							return false;
						}

						Customers.insert({
							Name: name,
							Phone: phone,
							Address: address,
						});

						swal('Success!', 'Customer added!', 'success');
						return true;
					}
				}
			}
		});
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
						var title = $('#txtEditProblemTitle').val().trim();
						var cost = $('#txtEditProblemCost').val().trim();
						var troubleshooting = $('#txtEditProblemTroubleshooting').val().trim();

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

		document.getElementById('txtEditProblemTitle').value = this.Description;
		document.getElementById('txtEditProblemCost').value = this.Cost;
		document.getElementById('txtEditProblemTroubleshooting').value = this.Troubleshooting;
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
						var title = $('#txtEditProblemTitle').val().trim();
						var cost = $('#txtEditProblemCost').val().trim();
						var troubleshooting = $('#txtEditProblemTroubleshooting').val().trim();

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
