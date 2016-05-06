Template.ticket.onCreated(function(){
    Session.set("queryFilter", ".");
})

Template.ticket.events({
    'click li': function (event) {
		paginationClickHelper(event);
	},
    
	'submit .new-search': function (event) {
		events.preventDefault();
		event.target.text.value = "";
	}
})

Template.ticketTable.helpers({
    ticket: function(){
        var rex = new RegExp( Session.get("queryFilter"), "gi");
        return getTicketCursor().fetch().map(function(item){
            item.customer = Customers.findOne({ _id: item.CustomerId }).Name;
            item.issue = CommonProblems.findOne({ _id: item.Problem }).Description;
            return item;
        }).filter(function(item){
            return (
                item.customer.match( rex )
                ||
                item.Status.match( rex )
                ||
                item.Date.toLocaleString().match( rex )
                ||
                item.issue.match( rex )
            );
        });
    },
    
    formatDate: function(d){
        return d.toLocaleString();
    },
})

Template.ticketTable.events({
    'click a#ticket_editTicket': function (event) {
    	event.preventDefault();

    	var obj = this; // need to store this reference to process the update operation
        
        Session.set("editTicketId", event.currentTarget.rel);
        
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
    					if (customer === null) {
    						swal('Oops...', 'Select a customer!', 'error');
    						return false;
    					}

    					if (customerID === obj.CustomerId && problemID === obj.Problem && notes === obj.Notes && status === obj.Status) {
    						swal('Oops...', 'No fields were changed', 'warning');
    						return false;
    					}

    					var problem = CommonProblems.findOne({ _id: problemID });
    					if (problem === null) {
    						swal('Oops...', 'Select a problem!', 'error');
    						return false;
    					}

    					Tickets.update({ _id: obj._id }, { $set: { CustomerId: customer._id || customer, Problem: problem._id || problem, Status: status, Notes: notes } });

    					if (status !== obj.Status && status === "Closed") {
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
    
    'keyup input#ticket_query': function(event, template){
        event.preventDefault();
        var value = template.find( event.currentTarget).value;
        Session.set("queryFilter",
            ( value === "" ? "." : value )
        )
    }
})

Template.tickets.onCreated(function(){
    Session.set("ticketPointer", true);
})

Template.tickets.helpers({
	
})

Template.tickets.events({

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
						if (customer === null) {
							swal('Oops...', 'Select a customer!', 'error');
							return false;
						}

						var problem = CommonProblems.findOne({ _id: problemID });
						if (problem === null) {
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

    'click button#export': function(event) {
        event.preventDefault();
        var csvArray = []
        var allTicket = Tickets.find({}).fetch();
        allTicket.forEach(function(row) {
            var customer = Customers.findOne({ _id: row.CustomerId });
            var problem = CommonProblems.findOne({ _id: row.Problem });

            csvObj = {
                "Customer_Name": customer.Name,
                "Date": row.Date,
                "Customer_Phone": customer.Phone,
                "Customer_Address": customer.Address,
                "Problem": problem.Description,
                "Problem_Cost": problem.Cost,
                "Status": row.Status,
                "Notes": row.Notes
            }
            csvArray.push(csvObj);
        });
       JSONToCSVConvertor(csvArray, "Ticket Data", true);
    },
    
    'click button#ticket_openTickets': function(event){
        event.preventDefault();
        Session.set("ticketPointer", true );
        $(event.currentTarget).addClass("btn-success");
        $("button#ticket_closedTickets").removeClass("btn-success");
    },
    
    'click button#ticket_closedTickets': function(event){
        event.preventDefault();
        Session.set("ticketPointer", false );
        $(event.currentTarget).addClass("btn-success");
        $("button#ticket_openTickets").removeClass("btn-success");
    }
})

Template.dialogEditTicket.onRendered(function(){
    var item = Tickets.findOne({ _id: Session.get("editTicketId") });
    $("select#selectEditTicketStatus option[value='"+item.Status+"']").attr("selected", "selected");
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

						if (name === '' || phone === '' || address === '') {
							swal('Oops...', 'All fields must be filled out!', 'error');
							return false;
						}

						if (name === obj.Name && phone === obj.Phone && address === obj.Address) {
							swal('Oops...', 'No fields were changed', 'warning');
							return false;
						}

						var match = Customers.findOne({ Name: new RegExp('^' + name + '$', "i") })
						if (match && match._id !== obj._id) {
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

						if (name === '' || phone === '' || address === '') {
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

						if (title === '' || cost === '' || troubleshooting === '') {
							swal('Oops...', 'All fields must be filled out!', 'error');
							return false;
						}

						if (title === obj.Description && cost === obj.Cost && troubleshooting === obj.Troubleshooting) {
							swal('Oops...', 'No fields were changed', 'warning');
							return false;
						}

						var match = CommonProblems.findOne({ Description: new RegExp('^' + title + '$', "i") })
						if (match && match._id !== obj._id) {
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

						if (title === '' || cost === '' || troubleshooting === '')
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
		swal('Success!', 'Stats Summary Clicked!', 'success');
	}
})

var renderTmp = function (template, data) {
	var node = document.createElement("div");
	document.body.appendChild(node);
	UI.renderWithData(template, data, node);
	return node;
}


//USED FOR THE EXPORT BUTTON
function JSONToCSVConvertor(JSONData, ReportTitle, ShowLabel) {
    //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
    var arrData = typeof JSONData !== 'object' ? JSON.parse(JSONData) : JSONData;
    
    var CSV = '';    
    //Set Report title in first row or line
    
    CSV += ReportTitle + '\r\n\n';

    //This condition will generate the Label/Header
    if (ShowLabel) {
        var row = "";
        
        //This loop will extract the label from 1st index of on array
        for (var index in arrData[0]) {
            
            //Now convert each value to string and comma-seprated
            row += index + ',';
        }

        row = row.slice(0, -1);
        
        //append Label row with line break
        CSV += row + '\r\n';
    }
    
    //1st loop is to extract each row
    for (var i = 0; i < arrData.length; i++) {
        var row = "";
        
        //2nd loop will extract each column and convert it in string comma-seprated
        for (var index in arrData[i]) {
            row += '"' + arrData[i][index] + '",';
        }

        row.slice(0, row.length - 1);
        
        //add a line break after each row
        CSV += row + '\r\n';
    }

    if (CSV === '') {
		swal('Oops...', 'Invalid data!', 'error');
        return;
    }   
    
    //Generate a file name
    var fileName = "MyReport_";
    //this will remove the blank-spaces from the title and replace it with an underscore
    fileName += ReportTitle.replace(/ /g,"_");   
    
    //Initialize file format you want csv or xls
    var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);
    
    // Now the little tricky part.
    // you can use either>> window.open(uri);
    // but this will not work in some browsers
    // or you will not get the correct file extension    
    
    //this trick will generate a temp <a /> tag
    var link = document.createElement("a");    
    link.href = uri;
    
    //set the visibility hidden so it will not effect on your web-layout
    link.style = "visibility:hidden";
    link.download = fileName + ".csv";
    
    //this part will append the anchor tag and remove it after automatic click
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

var getTicketCursor = function(){
    return Session.get("ticketPointer")
        ? Tickets.find( { CloseDate: { $not: {$ne: -1 } } } )
        : Tickets.find( { CloseDate: { $ne: -1 } } );
}