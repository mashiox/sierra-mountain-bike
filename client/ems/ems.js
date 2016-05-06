Template.ems.helpers({
    
})

Template.ems.events({
    'click li': function (event) {
		paginationClickHelper(event);
	}
})

Template.employees.helpers({
	all_employees: function () {
		return {
			collection: Employees,
			rowsPerPage: 5,
			showFilter: true,
			fields: [ 
			{
				key: 'name', 
				label:'Name',
				fn: function(value, object, key){
					return value.firstname+" "+ value.lastname;
				}
			},
			{
				key: 'home', 
				label:'Address',
				fn: function(value, object, key){
					return value.address+", "+ value.city+", "+value.state+" "+value.zip;
				}
			},
			{ key: 'name.firstname', hidden: true },
			{ key: 'position', label: "Position" },
			{ key: 'name.lastname', hidden: true },
			{ key: 'home.address', hidden: true },
			{ key: 'home.city', hidden: true },
			{ key: 'home.state', hidden: true },
			{ key: 'home.zip', hidden: true },
			{ key: 'options', label: 'Options', tmpl: Template.employeeActionsColumn }
			]
		}
	},

})

 Template.schedule.helpers({
            options: function() {
        return {
            header: {
                left: '',
                center: 'title',
                right: 'today month,agendaWeek,agendaDay prev,next'
            },
            class: "mainCalendar",
            height: 600,
            handleWindowResize:true
        };
        }
    });
  
  Template.schedule.events({
    'click .addEvent': function () {
            
            bootbox.dialog({
                title: "Create New Event...",
                onEscape: true,
                backdrop: true,
                message: renderTmp(Template.dialogEditEvent),
                buttons: {
                    success: {
                        label: "Create Event",
                        className: "btn-success",
                        callback: function () {
                            var emp_id = $("#selectEditEventTitle").val();
                            var event_emp = Employees.findOne({_id: emp_id});
                            var event_name = event_emp.name.firstname + " " + event_emp.name.lastname;
                            var event_month = $("#txtEditEventMonth").val();
                            var event_day = $("#txtEditEventDay").val();
                            var event_year = $("#txtEditEventYear").val();
                            var event_hour = $("#txtEditEventHour").val();
                            var event_min = $("#txtEditEventMin").val();
                            var event_date = new Date(event_year,event_month-1,event_day,event_hour,event_min);
                            var event_id = Events.insert({
                                title: event_name,
                                start: event_date,
                            });
                            var event={title: event_name, start:  event_date, id: event_id};
                            
                            $('#calendar').fullCalendar( 'renderEvent', event, true);
                            
                            swal('Success!', 'Event added!', 'success');
                            return true;
                        }
                    }
                }
            });

      }

});
Template.dialogEditEvent.helpers({
	All_Employees: function () {
		return Employees.find();
	}
})

Template.employees.events({
	'click button#btnEditEmployee': function (event) {
		event.preventDefault();

    	var obj = this; // need to store this reference to process the update operation

		bootbox.dialog({
			title: "Edit employee...",
			onEscape: true,
			backdrop: true,
			message: renderTmp(Template.dialogEditEmployee),
			buttons: {
				success: {
					label: "Update",
					className: "btn-success",
					callback: function () {
						var firstname = $('#txtEditEmployeeFName').val().trim();
						var lastname = $('#txtEditEmployeeLName').val().trim();
						var position = $('#txtEditEmployeePosition').val().trim();
						var wage = document.getElementById("txtEditEmployeeWage").value;
						wage = parseFloat(wage);
						var ssn = obj.ssn;
						var address = $('#txtEditEmployeeAddress').val().trim();
						var city = $('#txtEditEmployeeCity').val().trim();
						var state = $('#txtEditEmployeeState').val().trim();
						var zip = $('#txtEditEmployeeZip').val().trim();

    					var chk = null; // This is used to test null returns from db updates

						if (firstname === '' || lastname === '' || address === '' || city === '' ||
							state === '' || wage === '') {
							swal('Oops...', 'All fields must be filled out!', 'error');
							return false;
						}

						if ( !isNaN(wage)) {
							wage = wage.toFixed(2);
						}
						else {
							swal('Oops...', 'Wage must be a number !', 'error');
							return false;
						}

						if (ssn.length < 9) {
							swal('Oops...', 'SSN must be 9 characters long!', 'error');
							return false;
						}

						if (zip.length < 5) {
							swal('Oops...', 'Zip must be 5 characters long!', 'error');
							return false;
						}

						if (firstname !== obj.name.firstname || lastname !== obj.name.lastname) {
							chk = Employees.update({ _id: obj._id }, { $set: { name: { firstname: firstname, lastname: lastname }}});
							if (chk === null) {
								swal('Oops...', 'Error processing update', 'warning');
    							return false;
							}
						}
						else if (address!=obj.home.address || city !== obj.home.city || state !== obj.home.state || zip !== obj.home.zip) {
							chk = Employees.update({ _id: obj._id }, { $set: { home: { address: address, city: city, state: state, zip: zip }}});
							if (chk === null) {
								swal('Oops...', 'Error processing update', 'warning');
    							return false;
							}
						}
						else if (position!=obj.position) {
							chk = Employees.update({ _id: obj._id }, { $set: { position: position}});
							if (chk === null) {
								swal('Oops...', 'Error processing update', 'warning');
    							return false;
							}
						}
						else if (wage!=obj.wage) {
							chk = Employees.update({ _id: obj._id }, { $set: { wage: wage}});
							if (chk === null) {
								swal('Oops...', 'Error processing update', 'warning');
    							return false;
							}
						}
						else {
							swal('Oops...', 'No fields were changed', 'warning');
    						return false;
						}

						swal('Success!', 'Employee updated!', 'success');
						return true;
					}
				}
			}
		});
		document.getElementById('txtEditEmployeeFName').value = this.name.firstname;
    	document.getElementById('txtEditEmployeeLName').value = this.name.lastname;
    	document.getElementById('txtEditEmployeePosition').value = this.position;
    	document.getElementById('txtEditEmployeeWage').value = this.wage;
    	document.getElementById('txtEditEmployeeSSN').value = "***-**-****";
    	document.getElementById('txtEditEmployeeAddress').value = this.home.address;
    	document.getElementById('txtEditEmployeeCity').value = this.home.city;
    	document.getElementById('txtEditEmployeeState').value = this.home.state;
    	document.getElementById('txtEditEmployeeZip').value = this.home.zip;

	},

	'click button#btnAddEmployee': function (event) {
		event.preventDefault();

		bootbox.dialog({
			title: "Create new employee...",
			onEscape: true,
			backdrop: true,
			message: renderTmp(Template.dialogEditEmployee),
			buttons: {
				success: {
					label: "Add",
					className: "btn-success",
					callback: function () {
						var firstname = $('#txtEditEmployeeFName').val().trim();
						var lastname = $('#txtEditEmployeeLName').val().trim();
						var position = $('#txtEditEmployeePosition').val().trim();
						var wage = document.getElementById("txtEditEmployeeWage").value;
						wage = parseFloat(wage);
						var ssn = $('#txtEditEmployeeSSN').val().trim();
						var address = $('#txtEditEmployeeAddress').val().trim();
						var city = $('#txtEditEmployeeCity').val().trim();
						var state = $('#txtEditEmployeeState').val().trim();
						var zip = $('#txtEditEmployeeZip').val().trim();

						if (firstname === '' || lastname === '' || address === '' || city === '' ||
							state === '' || wage === '') {
							swal('Oops...', 'All fields must be filled out!', 'error');
							return false;
						}

						if (ssn.length < 9) {
							swal('Oops...', 'SSN must be 9 characters long!', 'error');
							return false;
						}

						if (zip.length < 5) {
							swal('Oops...', 'Zip must be 5 characters long!', 'error');
							return false;
						}

						if ( !isNaN(wage)) {
							wage = wage.toFixed(2);
						}
						else {
							swal('Oops...', 'Wage must be a number !', 'error');
							return false;
						}

						var match = Employees.findOne({ SSN: new RegExp('^' + ssn + '$', "i") });
						if (match) {
							swal('Oops...', 'That employee already exists!', 'error');
							return false;
						}

						Employees.insert({
							name: {firstname:firstname, lastname:lastname},
							position: position,
							wage: wage,
							ssn: ssn,
							home: {address:address, city:city, state:state, zip:zip}
						});

						swal('Success!', 'Employee added!', 'success');
						return true;
					}
				}
			}
		});
	}
})

var renderTmp = function (template, data) {
	var node = document.createElement("div");
	document.body.appendChild(node);
	UI.renderWithData(template, data, node);
	return node;
}